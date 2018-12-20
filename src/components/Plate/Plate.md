Плашка CRYPTO:

```jsx harmony
const _ = require('lodash');

const chartsData = [0.00032247, 0.00032247, 0.00073655,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.00078,0.0007617,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.00076,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.0007,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.000621,0.0007884,0.00062,0.00062,0.00062,0.00062,0.00079044,0.00079044,0.00079044,0.00061,0.00061,0.00061]

const assetsData = [
   {
      charts: chartsData,
      assetType: "crypto",
      baseCurrencyId: 502,
      change7d: "-2.03%",
      change24h: "-1.10%",
      capitalization: 22647433143,
      dashedName: "ETH-USDT",
      discount: 0,
      discountStr: "-",
      editTimestamp: 1535553023,
      frontType: "Crypto",
      fullName: "Ethereum / Tether USD ",
      id: 501,
      isHighlighted: false,
      isTradable: true,
      lastPrice: 221.19985,
      limitForDistribution: 0,
      ['logo.secret']: "a3ee3bb92a09953097255c51083d6de4",
      logoId: 21,
      logoUrl: "https://api.latoken.com/file/a3ee3bb92a09953097255c51083d6de4/thumbnail/medium",
      market: "USDT",
      minTokensInOrder: 0.001,
      pairType: "cryptoCurrencyPair",
      precisionAmount: 3,
      precisionPrice: 5,
      precisionTotal: 8,
      prevDayPrice: 223.66443,
      prevLastPrice: 221.19985,
      prevWeekPrice: 225.79037,
      priceDecimals: 7,
      settlementTimestamp: null,
      shortName: "ETH/USDT",
      tradedCurrencyId: 2,
      volume24h: 6320599.32816375,
    },
    {
      charts: chartsData,
      assetType: "crypto",
      baseCurrencyId: 503,
      change7d: "-2.03%",
      change24h: "-1.10%",
      capitalization: 22647433143,
      dashedName: "ETH-USDT",
      discount: 0,
      discountStr: "-",
      editTimestamp: 1535553023,
      frontType: "Crypto",
      fullName: "Ethereum / Tether USD ",
      id: 502,
      isHighlighted: false,
      isTradable: true,
      lastPrice: 221.19985,
      limitForDistribution: 0,
      ['logo.secret']: "a3ee3bb92a09953097255c51083d6de4",
      logoId: 21,
      logoUrl: "https://api.latoken.com/file/a3ee3bb92a09953097255c51083d6de4/thumbnail/medium",
      market: "USDT",
      minTokensInOrder: 0.001,
      pairType: "cryptoCurrencyPair",
      precisionAmount: 3,
      precisionPrice: 5,
      precisionTotal: 8,
      prevDayPrice: 223.66443,
      prevLastPrice: 221.19985,
      prevWeekPrice: 225.79037,
      priceDecimals: 7,
      settlementTimestamp: null,
      shortName: "ETH/USDT",
      tradedCurrencyId: 2,
      volume24h: 6320599.32816375,
    },
    {
      charts: chartsData,
      assetType: "crypto",
      baseCurrencyId: 502,
      change7d: "-2.03%",
      change24h: "-1.10%",
      capitalization: 22647433143,
      dashedName: "ETH-USDT",
      discount: 0,
      discountStr: "-",
      editTimestamp: 1535553023,
      frontType: "Crypto",
      fullName: "Ethereum / Tether USD ",
      id: 502,
      isHighlighted: false,
      isTradable: true,
      lastPrice: 221.19985,
      limitForDistribution: 0,
      ['logo.secret']: "a3ee3bb92a09953097255c51083d6de4",
      logoId: 21,
      logoUrl: "https://api.latoken.com/file/a3ee3bb92a09953097255c51083d6de4/thumbnail/medium",
      market: "USDT",
      minTokensInOrder: 0.001,
      pairType: "cryptoCurrencyPair",
      precisionAmount: 3,
      precisionPrice: 5,
      precisionTotal: 8,
      prevDayPrice: 223.66443,
      prevLastPrice: 221.19985,
      prevWeekPrice: 225.79037,
      priceDecimals: 7,
      settlementTimestamp: null,
      shortName: "ETH/USDT",
      tradedCurrencyId: 2,
      volume24h: 6320599.32816375,
    }
];

const assets = {
  favAssetsIds: [502, 501, 503],
  assetsData: assetsData,
};

const getCurrencyByCurrId = currencyId => {

  return assetsData;
};

const globals = {
  getCurrencyByCurrId: getCurrencyByCurrId
};

function toggleFavAsset(assetId) { console.log('toggle fav for assetId', assetId); setState({isFav: !state.isFav})}
function onPlateClick(assetId) { console.log('click for assetId', assetId); }


initialState = { 
  isFav: false, 
};
<div style={{ display: 'flex' }}>
<Plate 
    id={502}
    assets={assets}
    globals={globals}
    onPlateClick={onPlateClick}
 />
<Plate 
    id={501}
    assets={assets}
    globals={globals}
    onPlateClick={onPlateClick}
    assetType={null}
 />
 <Plate 
     id={501}
     assets={assets}
     globals={globals}
     onPlateClick={onPlateClick}
     assetType={null}
     assetType={null}
         chartsData={[0,0]}
         currency={'LA'}
         fullName={'Augur / LA Token'}
         i18n={{}}
         isFav={state.isFav}
         assetId={38}
         key={39}
         logoUrl={'http://api.latoken.com/file/a3ee3bb92a09953097255c51083d6de4/thumbnail/medium'}
         price={'0.00004321'}
         priceChangePercent={0}
         shortName={'REP/LA'}
         dashedName={'REP-LA'}
         isHighlighted={false}
         onFavClick={toggleFavAsset}
         onPlateClick={onPlateClick}
         valuationUSD={0.15}
         isHighlighted={true}
         isTradable={true}
  />
 </div>
```

Плашка ICO:

```jsx harmony
const _ = require('lodash');
const moment = require('moment');
function toggleFavAsset(assetId) { console.log('toggle fav for assetId', assetId); setState({isFav: !state.isFav})}
function onPlateClick(assetId) { console.log('click for assetId', assetId); }
initialState = { 
  isFav: false, 
};
<div style={{ display: 'flex' }}>
<Plate 
    assetType={'tokenSale'}
    chartsData={[]}
    currency={'LA'}
    fullName={'Augur / LA Token'}
    i18n={{}}
    isFav={state.isFav}
    assetId={39}
    key={39}
    logoUrl={'http://api.latoken.com/file/48e47b511c8a7e935bb42c8e871b29b7/thumbnail/medium'}
    price={'0.00001234'}
    shortName={'REP/LA'}
    dashedName={'REP-LA'}
    isHighlighted={false}
    onFavClick={toggleFavAsset}
    onPlateClick={onPlateClick}
    discount={10.15}
    icoEnd={moment().add(3, 'days').endOf('day').unix()}
    targetCap={20000}
    totalRaised={13500}
    bottomText={'Commerce & Trade'}
    isTradable={true}
 />
<Plate 
    assetType={'tokenSale'}
    chartsData={[]}
    currency={'LA'}
    fullName={'Augur / LA Token'}
    i18n={{}}
    isFav={state.isFav}
    assetId={39}
    key={40}
    logoUrl={'http://api.latoken.com/file/48e47b511c8a7e935bb42c8e871b29b7/thumbnail/medium'}
    price={'0.00001234'}
    shortName={'REP/LA'}
    dashedName={'REP-LA'}
    isHighlighted={false}
    onFavClick={toggleFavAsset}
    onPlateClick={onPlateClick}
    discount={0}
    icoEnd={moment().subtract(1, 'days').endOf('day').unix()}
    targetCap={20000}
    totalRaised={13500}
    bottomText={'Commerce & Trade'}
    isTradable={true}
 />
<Plate 
    assetType={'tokenSale'}
    chartsData={[]}
    currency={'LA'}
    fullName={'Augur / LA Token'}
    i18n={{}}
    isFav={state.isFav}
    assetId={39}
    key={41}
    logoUrl={'http://api.latoken.com/file/48e47b511c8a7e935bb42c8e871b29b7/thumbnail/medium'}
    price={'0.00001234'}
    shortName={'REP/LA'}
    dashedName={'REP-LA'}
    isHighlighted={false}
    onFavClick={toggleFavAsset}
    onPlateClick={onPlateClick}
    discount={5}
    icoEnd={moment().startOf('day').unix()}
    targetCap={20000}
    totalRaised={0}
    bottomText={'Commerce & Trade'}
    isTradable={true}
 />
 </div>
```
