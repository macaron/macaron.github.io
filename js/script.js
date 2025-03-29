document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得
    const modal = document.getElementById('modal');
    const mantelaButton = document.getElementById('mantelaButton');
    const closeButton = document.querySelector('.close');
    const jsonContent = document.getElementById('jsonContent');
    const typewriterElement = document.getElementById('typewriter');
    
    // タイプライターエフェクト用のテキスト
    const text = '東京広域電話網';
    
    // タイプライターエフェクトの実装
    function typeWriter(element, text, speed = 300, index = 0) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(() => typeWriter(element, text, speed, index), speed);
        }
    }
    
    // ページ読み込み時にタイプライターエフェクトを開始
    // 一度テキストを空にしてから開始
    typewriterElement.textContent = '';
    setTimeout(() => {
        typeWriter(typewriterElement, text);
    }, 1000);
    
    // JSONデータのURL
    const jsonUrl = 'http://macaron.github.io/.well-known/mantela.json';
    
    // ボタンクリックでモーダルを開く
    mantelaButton.addEventListener('click', function() {
        modal.style.display = 'block';
        displayJsonUrl();
    });
    
    // 閉じるボタンでモーダルを閉じる
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // モーダル外クリックでモーダルを閉じる
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Escキーでモーダルを閉じる
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
    
    // JSONデータを取得して表示する関数
    function displayJsonUrl() {
        // ローディング表示
        jsonContent.innerHTML = `<div class="loading">データを読み込み中...</div>`;
        
        // JSONデータを取得
        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました');
                }
                return response.json();
            })
            .then(data => {
                // JSONデータを整形して表示
                jsonContent.innerHTML = `
                    <div class="json-data">
                        <p>JSONデータの内容：</p>
                        <pre class="json-formatted">${JSON.stringify(data, null, 2)}</pre>
                        <p class="source-note">データソース: <a href="${jsonUrl}" target="_blank">${jsonUrl}</a></p>
                    </div>
                `;
            })
            .catch(error => {
                // エラー表示
                jsonContent.innerHTML = `
                    <div class="error-message">
                        <p>データの取得に失敗しました: ${error.message}</p>
                        <p>URL: <a href="${jsonUrl}" target="_blank">${jsonUrl}</a></p>
                    </div>
                `;
                console.error('JSONデータの取得エラー:', error);
            });
    }
    
    // 背景動画の読み込みエラー処理
    const video = document.getElementById('bgVideo');
    const fallbackBg = document.querySelector('.fallback-bg');
    
    // 動画の読み込みエラー処理
    video.addEventListener('error', function() {
        console.error('動画の読み込みに失敗しました');
        video.style.display = 'none';
        fallbackBg.style.zIndex = '-1';
    });
    
    // 動画が正常に再生開始された場合
    video.addEventListener('playing', function() {
        console.log('動画の再生を開始しました');
        fallbackBg.style.opacity = '0.1'; // 動画の上に薄く背景を重ねる（コントラスト向上のため）
    });
    
    // ページ読み込み時に動画の状態をチェック
    setTimeout(function() {
        if (video.readyState === 0) {
            // 動画がまだ読み込まれていない場合
            console.warn('動画の読み込みに時間がかかっています');
            fallbackBg.style.zIndex = '-1';
        }
    }, 2000);
});
