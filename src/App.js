import React, { useState, useEffect } from 'react';
import EtfCard from './components/EtfCard';
import PortfolioChart from './components/PortfolioChart';
import TrendChart from './components/TrendChart'; // 👈 방금 만든 라인 차트 불러오기!
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // 🌟 사용자가 클릭해서 '선택한 종목'을 기억하는 상태 (처음 켰을 땐 VOO를 보여줌)
  const [selectedSymbol, setSelectedSymbol] = useState('VOO');
  
  // 🔑 여기에 본인의 Finnhub API Key를 넣으세요!
  const API_KEY = 'd6qd2f1r01qhcrmjoec0d6qd2f1r01qhcrmjoecg'; 

  const [myPortfolio, setMyPortfolio] = useState([
    { symbol: 'VOO', quantity: 10 },
    { symbol: 'QQQ', quantity: 15 },
    { symbol: 'JEPI', quantity: 50 },
    { symbol: 'TQQQ', quantity: 20 }
  ]);

  const [newSymbol, setNewSymbol] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAddAsset = () => {
    if (!newSymbol || !newQuantity) return alert("종목명과 수량을 모두 입력해주세요!");
    const symbol = newSymbol.toUpperCase();
    const quantity = parseFloat(newQuantity);

    setMyPortfolio(prev => {
      const existing = prev.find(item => item.symbol === symbol);
      if (existing) {
        return prev.map(item => item.symbol === symbol ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { symbol, quantity }];
    });
    setNewSymbol('');
    setNewQuantity('');
  };

  const handleDeleteAsset = (targetSymbol) => {
    setMyPortfolio(prev => prev.filter(item => item.symbol !== targetSymbol));
    // 만약 지운 종목이 현재 차트에서 보고 있던 종목이라면, 안전하게 VOO로 차트 초기화!
    if (selectedSymbol === targetSymbol) setSelectedSymbol('VOO');
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={toggleTheme} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: isDarkMode ? '#333' : '#ddd', color: isDarkMode ? '#fff' : '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}>
          {isDarkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      <h1>📊 Smart ETF Portfolio Visualizer</h1>
      <p style={{ color: 'var(--text-secondary)' }}>실시간 US ETF 대시보드</p>
      <hr style={{ borderColor: 'var(--card-border)', marginBottom: '20px' }}/>
      
      <div style={{
        backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: '8px', padding: '20px', margin: '0 auto 20px auto', maxWidth: '800px',
        display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'
      }}>
        <input 
          type="text" placeholder="종목명 (예: SPY)" value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--card-border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', width: '130px', fontWeight: 'bold' }}
        />
        <input 
          type="number" placeholder="수량" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--card-border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', width: '100px' }}
        />
        <button onClick={handleAddAsset} style={{ padding: '10px 20px', fontWeight: 'bold', color: '#fff', backgroundColor: '#c84a31', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          매수 (추가)
        </button>
        <button onClick={handleRefresh} style={{ padding: '10px 20px', fontWeight: 'bold', color: '#fff', backgroundColor: '#1261c4', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          🔄 현재가 갱신
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
        {myPortfolio.map((item) => (
          <div 
            key={item.symbol} 
            style={{ 
              position: 'relative', 
              /* 🌟 선택된 카드는 테두리를 빨간색으로 빛나게 강조! */
              border: selectedSymbol === item.symbol ? '2px solid #c84a31' : '2px solid transparent',
              borderRadius: '10px', transition: 'all 0.2s', transform: selectedSymbol === item.symbol ? 'scale(1.05)' : 'scale(1)'
            }}
            onClick={() => setSelectedSymbol(item.symbol)} // 👈 카드 아무 데나 클릭하면 차트 종목 변경!
          >
            <EtfCard symbol={item.symbol} apiKey={API_KEY} refreshTrigger={refreshTrigger} />
            
            <button 
              onClick={(e) => { 
                e.stopPropagation(); // 👈 삭제 버튼 누를 때 카드가 클릭되는 것 방지!
                handleDeleteAsset(item.symbol); 
              }}
              style={{ position: 'absolute', top: '22px', right: '22px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* 🌟 1. 방금 만든 라인 차트 영역 (클릭한 종목의 데이터를 보여줌) */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <TrendChart symbol={selectedSymbol} apiKey={API_KEY} />
      </div>

      {/* 🌟 2. 기존에 있던 파이 차트 영역 */}
      <div style={{ maxWidth: '800px', margin: '20px auto 0 auto' }}>
        <PortfolioChart portfolio={myPortfolio} apiKey={API_KEY} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;