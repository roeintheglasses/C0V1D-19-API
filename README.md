# C0V1D-19-API

This API Provides coronavirus disease (COVID-19) time series listing confirmed cases, reported deaths and reported recoveries. Data is disaggregated by country (and sometimes subregion). 

### This dataset includes time series data tracking the number of people affected by COVID-19 worldwide, including:

confirmed tested cases of Coronavirus infection
the number of people who have reportedly died while sick with Coronavirus

### Data
Data is in CSV format and updated daily. It is sourced from this upstream repository maintained by the amazing team at Johns Hopkins University Center for Systems Science and Engineering (CSSE) who have been doing a great public service from an early point by collating data from around the world.

I have cleaned and normalized that data, for example tidying dates and consolidating several files into normalized time series. We have also added some metadata such as column descriptions and data packaged it.
  

## Getting Started  

Clone repo using

```

git clone https://github.com/roeintheglasses/C0V1D-19-API.git

```
### Install dependencies and run the server

within the repo directory

```

npm install
npm start

```
# API Routes and Usage
API URL - roe-c0v1d-19-api.herokuapp.com/api

```
~url~ /api/cases

```

For Fatality Rate

```
~url~ /api/fatality-rate

```
## Don't forget to change 'url' to whatever you're using, if localhost use http://localhost/api/

## Author :

*  **Hrishi Jangir** - *Other Works* - [Github](https://github.com/roeintheglasses)

## Contributors 

* Documentation by : **Sparsh Bajaj** - [Website](https://sparshbajaj.co)  [Github](https://github.com/sparshbajaj)


### [License: MIT](LICENSE.md)  