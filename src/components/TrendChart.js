import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TrendChart({ symbol, apiKey }) {
  const [data, setData] = useState([]);
  const [isMockData, setIsMockData] = useState(false); // 🌟 가짜 데이터인지 표시하는 상태

  useEffect(() => {
    if (!symbol) return;
    
    const fetchHistoricalData = async () => {
      setData([]); 
      setIsMockData(false);

      try {
        const to = Math.floor(Date.now() / 1000);
        const from = to - (30 * 24 * 60 * 60); 

        const response = await axios.get(
          `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
        );

        if (response.data.s === 'ok') {
          const formattedData = response.data.t.map((timestamp, index) => {
            const date = new Date(timestamp * 1000);
            return {
              date: `${date.getMonth() + 1}/${date.getDate()}`, 
              price: response.data.c[index]
            };
          });
          setData(formattedData);
        } else {
          // 서버가 응답은 했지만 데이터가 없다고 할 때 강제로 에러 발생!
          throw new Error("No Data from API"); 
        }
      } catch (error) {
        console.warn(`${symbol} API 호출 제한! 방어 로직 작동 🛡️ (시뮬레이션 데이터로 대체합니다)`);
        setIsMockData(true); // 에러 발생 시 가짜 데이터 모드 ON!
        
        // 🌟 [우아한 실패 처리] 에러가 나면, 진짜 같은 30일치 주가 데이터를 수학적으로 만들어냄!
        const mockData = [];
        // 종목별로 대략적인 시작 가격 설정
        let basePrice = symbol === 'VOO' ? 450 : symbol === 'QQQ' ? 400 : symbol === 'JEPI' ? 55 : 60;
        
        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          // 매일 -2% ~ +2% 사이로 랜덤하게 주가가 변동하도록 계산
          const randomChange = 1 + ((Math.random() - 0.5) * 0.04);
          basePrice = basePrice * randomChange;

          mockData.push({
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            price: parseFloat(basePrice.toFixed(2))
          });
        }
        setData(mockData);
      }
    };
    
    // API 호출 횟수 제한을 조금이라도 피하기 위해 0.5초 쉬었다가 요청!
    const timer = setTimeout(() => {
      fetchHistoricalData();
    }, 500);

    return () => clearTimeout(timer);
  }, [symbol, apiKey]);

  return (
    <div style={{
      backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)',
      borderRadius: '8px', padding: '20px', marginTop: '20px', width: '100%', maxWidth: '800px', boxSizing: 'border-box'
    }}>
      <h3 style={{ color: 'var(--text-primary)', marginTop: 0, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>📈 <span style={{ color: '#c84a31' }}>{symbol}</span> 최근 30일 주가 흐름</span>
        
        {/* 🌟 가짜 데이터 모드일 때만 우측 상단에 작게 표시 */}
        {isMockData && <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>*API 초과: 시뮬레이션 데이터</span>}
      </h3>
      
      {data.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis domain={['auto', 'auto']} stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px' }} 
                itemStyle={{ color: '#c84a31', fontWeight: 'bold' }}
                formatter={(value) => [`$${value}`, "주가"]}
              />
              <Line type="monotone" dataKey="price" stroke="#c84a31" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ color: 'var(--text-secondary)' }}>데이터 분석 및 차트 렌더링 중... ⏳</p>
      )}
    </div>
  );
}

export default TrendChart;