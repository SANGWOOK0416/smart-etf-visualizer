import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 👈 App.js에서 넘겨준 refreshTrigger를 받음!
function EtfCard({ symbol, apiKey, refreshTrigger }) { 
  const [data, setData] = useState({ price: null, change: null, percent: null });

  useEffect(() => {
    const fetchPrice = async () => {
      // 새로고침 누를 때마다 잠깐 '로딩중' 글씨를 띄우기 위한 센스!
      setData({ price: null, change: null, percent: null }); 
      
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
        );
        setData({
          price: response.data.c,
          change: response.data.d,
          percent: response.data.dp
        });
      } catch (error) {
        console.error(`${symbol} 데이터를 가져오는데 실패했어요!`, error);
      }
    };
    fetchPrice();
  }, [symbol, apiKey, refreshTrigger]); // 🚨 핵심! 이 배열 안에 refreshTrigger를 넣으면, 숫자가 바뀔 때마다 이 코드가 다시 실행됨!

  const isPositive = data.change > 0;
  const color = isPositive ? '#dc3545' : '#007bff'; 
  const sign = isPositive ? '+' : '';

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '15px',
      padding: '20px',
      margin: '10px',
      width: '180px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '22px' }}>{symbol}</h3>
      
      {data.price ? (
        <>
          <p style={{ margin: '0', fontSize: '26px', fontWeight: '900' }}>
            ${data.price.toFixed(2)}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: color }}>
            {sign}{data.change.toFixed(2)} ({sign}{data.percent.toFixed(2)}%)
          </p>
        </>
      ) : (
        <p style={{ color: '#999' }}>데이터 로딩중... ⏳</p>
      )}
    </div>
  );
}

export default EtfCard;