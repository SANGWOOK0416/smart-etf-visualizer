import React, { useState } from 'react';
import EtfCard from './components/EtfCard';
import './App.css';

function App() {
  // 🎯 새로고침을 위한 방아쇠(상태) 만들기! 초기값은 0
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 🔑 여기에 본인의 Finnhub API Key를 넣으세요!
  const API_KEY = 'd6qd2f1r01qhcrmjoec0d6qd2f1r01qhcrmjoecg'; 
  const etfList = ['VOO', 'QQQ', 'JEPI', 'TQQQ'];

  // 🖱️ 버튼을 누르면 방아쇠 숫자를 1씩 올리는 함수
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
      <h1>📊 Smart ETF Portfolio Visualizer</h1>
      <p>실시간 US ETF 대시보드</p>
      <hr style={{ marginBottom: '20px' }}/>
      
      {/* 🚀 멋진 새로고침 버튼 추가! */}
      <button 
        onClick={handleRefresh}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: '#28a745',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      >
        🔄 실시간 가격 새로고침
      </button>

      <h2>🔥 나의 관심 ETF 실시간 현황</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {etfList.map((ticker) => (
          <EtfCard 
            key={ticker} 
            symbol={ticker} 
            apiKey={API_KEY} 
            refreshTrigger={refreshTrigger} /* 👈 부품들에게 방아쇠 전달! */
          />
        ))}
      </div>
    </div>
  );
}

export default App;