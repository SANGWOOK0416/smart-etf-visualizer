import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EtfCard({ symbol, apiKey, refreshTrigger }) { 
  const [data, setData] = useState({ price: null, change: null, percent: null });

  useEffect(() => {
    const fetchPrice = async () => {
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
        console.error(`${symbol} 데이터 로딩 실패!`, error);
      }
    };
    fetchPrice();
  }, [symbol, apiKey, refreshTrigger]);

  const isPositive = data.change > 0;
  const color = isPositive ? '#c84a31' : '#1261c4'; 
  const sign = isPositive ? '+' : '';

  return (
    <div style={{
      /* 🌟 핵심 포인트: 배경색과 테두리를 CSS 변수로 연결! */
      backgroundColor: 'var(--card-bg)',       
      border: `1px solid var(--card-border)`,  
      borderRadius: '8px',
      padding: '20px', 
      margin: '10px', 
      width: '180px',
      transition: 'background-color 0.3s ease, border-color 0.3s ease', 
      cursor: 'pointer'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        {/* 🌟 글자색도 CSS 변수로 연결! */}
        <h3 style={{ margin: '0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: 'bold' }}>{symbol}</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>US</span>
      </div>
      
      {data.price ? (
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: color }}>
            ${data.price.toFixed(2)}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', fontWeight: '500', color: color }}>
            {sign}{data.percent.toFixed(2)}% <span style={{fontSize:'12px', color:color}}>{sign}{data.change.toFixed(2)}</span>
          </p>
        </div>
      ) : (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'right', margin: 0 }}>로딩중...</p>
      )}
    </div>
  );
}

export default EtfCard;