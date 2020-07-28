import React, { useEffect, useState } from 'react';
import './App.css';
import Row from './Row'

const BASE_URL = 'https://api.exchangeratesapi.io/latest'

function App() {
  const [currOptions, setCurrOptions] = useState([])
  const [fromCurr, setFromCurr] = useState()
  const [toCurr, setToCurr] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrOptions([data.base, ...Object.keys(data.rates)])
        setFromCurr(data.base)
        setToCurr(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurr != null && toCurr != null) {
      fetch(`${BASE_URL}?base=${fromCurr}&symbols=${toCurr}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurr]))
    }
  }, [fromCurr, toCurr])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }
  return (

    <div className = "wrap">
    <h1>Currency Converter</h1>
      <div className = "conversion">
      {fromAmount} {fromCurr} is equal to {Math.round(toAmount * 100)/100} {toCurr}
      </div>
      <Row
        currOptions={currOptions}
        selectedCurrency={fromCurr}
        onChangeCurrency={e => setFromCurr(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <Row
        currOptions={currOptions}
        selectedCurrency={toCurr}
        onChangeCurrency={e => setToCurr(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </div>

  );
}

export default App;