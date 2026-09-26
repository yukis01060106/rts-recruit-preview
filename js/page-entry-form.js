// 求人ページから来た場合は、見ていた職種を表示
    (function () {
      const map = { beginner: '未経験エンジニア', experienced: '経験者エンジニア', sales: '営業担当', marketing: 'マーケティング担当' };
      const pos = new URLSearchParams(location.search).get('position');
      if (pos && map[pos]) {
        document.getElementById('positionLabel').textContent = map[pos];
        document.getElementById('positionBadge').hidden = false;
      }
    })();
