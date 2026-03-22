import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// 💡 종목별 대략적인 연간 배당 수익률 (Mock Data)
const DIVIDEND_YIELDS = {
  'VOO': 1.4,   // 약 1.4%
  'QQQ': 0.6,   // 약 0.6%
  'JEPI': 8.5,  // 고배당 약 8.5%
  'TQQQ': 1.1   // 약 1.1%
};

function PortfolioChart({ portfolio, apiKey, refreshTrigger }) {
  const [chartData, setChartData] = useState([]);
  const [totalAsset, setTotalAsset] = useState(0);
  const [totalDividend, setTotalDividend] = useState(0); // 👈 총 배당금 상태 추가!

  useEffect(() => {
    const fetchAllPrices = async () => {
      try {
        const promises = portfolio.map(item =>
          axios.get(`https://finnhub.io/api/v1/quote?symbol=${item.symbol}&token=${apiKey}`)
        );
        const responses = await Promise.all(promises);

        let assetSum = 0;
        let dividendSum = 0; // 배당금 누적 변수

        const newChartData = responses.map((res, index) => {
          const currentPrice = res.data.c;
          const symbol = portfolio[index].symbol;
          const quantity = portfolio[index].quantity;
          
          const assetValue = currentPrice * quantity; 
          
          // 💸 내 자산 * (해당 종목 배당률 / 100) = 예상 연간 배당금
          const expectedDividend = assetValue * (DIVIDEND_YIELDS[symbol] / 100);

          assetSum += assetValue; 
          dividendSum += expectedDividend; // 배당금 합치기!

          return {
            name: symbol,
            value: parseFloat(assetValue.toFixed(2))
          };
        });

        setChartData(newChartData);
        setTotalAsset(assetSum);
        setTotalDividend(dividendSum); // 상태 업데이트
      } catch (error) {
        console.error("차트 데이터를 가져오는데 실패했습니다.", error);
      }
    };

    fetchAllPrices();
  }, [portfolio, apiKey, refreshTrigger]);

  return (
    <div style={{ 
      marginTop: '40px', padding: '30px', border: '1px solid #ddd', 
      borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' 
    }}>
      {/* 💰 총 자산 & 💸 예상 배당금을 나란히 표시! */}
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: 0 }}>
          💰 총 자산: <span style={{ color: '#007bff' }}>${totalAsset.toFixed(2)}</span>
        </h2>
        <h2 style={{ color: '#333', margin: 0 }}>
          💸 예상 연 배당금: <span style={{ color: '#28a745' }}>${totalDividend.toFixed(2)}</span>
        </h2>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {chartData.length > 0 ? (
          <PieChart width={550} height={400}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        ) : (
          <p>데이터 분석 및 차트 렌더링 중... ⏳</p>
        )}
      </div>
    </div>
  );
}

export default PortfolioChart;