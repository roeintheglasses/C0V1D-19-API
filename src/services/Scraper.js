const cheerio = require('cheerio');
const request = require('request');
const csv = require('csvtojson');

class Scraper {
  constructor() {
    this.timeSeriesURL =
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series';
  }

  getHTML(url) {
    return new Promise((resolve, reject) => {
      request.get(url, (error, _, body) => {
        if (error) return reject(error);
        resolve(cheerio.load(body));
      });
    });
  }

  async fetchTimeSeries() {
    const roundOffCoord = coord => parseFloat(coord.trim()).toFixed(5);

    const data = [];

    // Load confirmed cases
    const confirmedRows = await this.getConfirmedCases();
    const headers = Object.keys(confirmedRows[0]);

    // Load recovered sheet
    const recoveredRows = await this.getRecovered();

    // Load recovered sheet
    const deathRows = await this.getDeaths();

    confirmedRows.forEach((row) => {
      const obj = {};
      headers.slice(0, 4).forEach(header => {
        obj[header] = row[header];
      });
      obj.dates = [];

      headers.slice(4).forEach((header, idx) => {
        // Skip row when it's empty
        if (row[header] === '') {
          confirmedRows.splice(idx, 1);
          return;
        }

        obj.dates.push({
          date: header,
          confirmed: +row[header] || 0,
          recovered:
            +recoveredRows.find(
              i =>
              roundOffCoord(i.Lat) === roundOffCoord(row.Lat) &&
              roundOffCoord(i.Long) === roundOffCoord(row.Long)
            )[header] || 0,
          death:
            +deathRows.find(
              i =>
              roundOffCoord(i.Lat) === roundOffCoord(row.Lat) &&
              roundOffCoord(i.Long) === roundOffCoord(row.Long)
            )[header] || 0,
        });
      });

      data.push(obj);
    });

    return {
      total_confirmed: data.reduce(
        (a, b) => a + b.dates[b.dates.length - 1].confirmed,
        0
      ),
      total_recovered: data.reduce(
        (a, b) => a + b.dates[b.dates.length - 1].recovered,
        0
      ),
      total_death: data.reduce(
        (a, b) => a + b.dates[b.dates.length - 1].death,
        0
      ),
      data
    };
  }

  parseCSV(url) {
    return new Promise((resolve, reject) => {
      const rows = [];
      csv()
        .fromStream(request.get(url))
        .subscribe(
          json => {
            rows.push(json);
          },
          () => {
            reject();
          },
          () => {
            resolve(rows);
          }
        );
    });
  }

  getConfirmedCases() {
    return this.parseCSV(
      `${this.timeSeriesURL}/time_series_19-covid-Confirmed.csv`
    );
  }

  getRecovered() {
    return this.parseCSV(
      `${this.timeSeriesURL}/time_series_19-covid-Recovered.csv`
    );
  }

  getDeaths() {
    return this.parseCSV(
      `${this.timeSeriesURL}/time_series_19-covid-Deaths.csv`
    );
  }

  async getFatalityRate() {
    const url = 'https://www.worldometers.info/coronavirus/coronavirus-age-sex-demographics/';

    const $ = await this.getHTML(url);

    const byAgeRows = $('h4:contains("COVID-19 Fatality Rate by AGE:")').next().next().find('table tbody tr');
    const byAge = [];
    $(byAgeRows).each((idx, el) => {
      if (idx === 0) return;

      byAge.push({
        age: $(el).children('td').eq(0).text().trim(),
        rate: $(el).children('td').eq(2).text().trim(),
      });
    });

    const bySexRows = $('h4:contains("COVID-19 Fatality Rate by SEX:")').next().next().find('table tbody tr');
    const bySex = [];
    $(bySexRows).each((idx, el) => {
      if (idx === 0) return;

      bySex.push({
        sex: $(el).children('td').eq(0).text().trim(),
        rate: $(el).children('td').eq(1).text().trim(),
      });
    });

    const byComorbidityRows = $('h4:contains("COVID-19 Fatality Rate by COMORBIDITY:")').next().next().find('table tbody tr');
    const byComorbidity = [];
    $(byComorbidityRows).each((idx, el) => {
      if (idx === 0) return;

      byComorbidity.push({
        preExistingCondition: $(el).children('td').eq(0).text().trim(),
        rate: $(el).children('td').eq(2).text().trim(),
      });
    });

    return {
      byAge,
      bySex,
      byComorbidity
    };
  }
}

module.exports = Scraper;