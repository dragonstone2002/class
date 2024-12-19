// Teachable Machine에서 생성된 모델 경로
const URL = "my_model/";

let model, labelContainer, maxPredictions;

// 모델을 초기화하고 예측 레이블 컨테이너를 설정하는 함수
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // 레이블 컨테이너 초기화
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    } catch (error) {
        console.error("Model loading failed:", error);
    }
}

// 이미지 업로드 처리 함수
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imgElement = document.getElementById("uploadedImage");
    const reader = new FileReader();

    reader.onload = function (e) {
        imgElement.src = e.target.result;
        imgElement.onload = function () {
            predict(imgElement);
        };
    };
    reader.readAsDataURL(file);
}

// 예측 함수
async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    const graphContainer = document.getElementById("graph-container");
    const resultContainer = document.getElementById("result-container");
    graphContainer.innerHTML = ""; // 기존 그래프 초기화
    resultContainer.innerHTML = ""; // 기존 결과 텍스트 초기화

    let highestPrediction = { className: "", probability: 0 };

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(2); // 0-100 퍼센트로 변환

        // 가장 높은 예측 값 찾기
        if (prediction[i].probability > highestPrediction.probability) {
            highestPrediction = { className, probability };
        }

        // 레이블 텍스트 추가
        const labelDiv = document.createElement("div");
        labelDiv.className = "graph-label";
        labelDiv.innerText = `${className}: ${probability}%`;

        // 그래프 바 추가
        const barDiv = document.createElement("div");
        barDiv.className = `graph-bar color-${i % 2 === 0 ? 1 : 2}`; // 색상 클래스 추가
        barDiv.style.width = "0"; // 초기 width를 0으로 설정

        graphContainer.appendChild(labelDiv);
        graphContainer.appendChild(barDiv);

        // 애니메이션으로 width 증가
        setTimeout(() => {
            barDiv.style.width = `${probability}%`;
        }, 100);
    }

    // 가장 높은 예측 결과 표시
    const resultDiv = document.createElement("div");
    resultDiv.className = "result-text";
    resultDiv.innerText = `당신은 ${highestPrediction.className}입니다!`;
    resultContainer.appendChild(resultDiv);
}



// 초기화
init();
document.getElementById("imageInput").addEventListener("change", handleImageUpload);
