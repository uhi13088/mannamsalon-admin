// ===================================================================
// 맛남살롱 계약서 서명 시스템
// ===================================================================

let contractId = null;
let contractData = null;
let canvas = null;
let ctx = null;
let isDrawing = false;
let hasSignature = false;

// ===================================================================
// 초기화
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ 서명 페이지 로드 시작');
  
  try {
    // URL에서 계약서 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    contractId = urlParams.get('id');
    
    console.log('🔍 URL:', window.location.href);
    console.log('🔍 계약서 ID:', contractId);
    
    if (!contractId) {
      console.error('❌ 계약서 ID가 없습니다');
      showError('유효하지 않은 계약서 링크입니다.<br>URL에 계약서 ID(?id=...)가 포함되어 있는지 확인해주세요.');
      return;
    }
    
    // 계약서 데이터 로드
    loadContractData();
    
    // 서명 패드 초기화
    initSignaturePad();
  } catch (error) {
    console.error('❌ 초기화 오류:', error);
    showError('페이지 로드 중 오류가 발생했습니다: ' + error.message);
  }
});

// ===================================================================
// 계약서 데이터 로드 (시뮬레이션)
// ===================================================================

function loadContractData() {
  console.log('📥 계약서 데이터 로드 시작...');
  
  setTimeout(() => {
    try {
      const storageKey = `contract_${contractId}`;
      console.log('🔍 localStorage 키:', storageKey);
      
      // localStorage에서 계약서 데이터 가져오기
      const savedData = localStorage.getItem(storageKey);
      
      console.log('📦 저장된 데이터:', savedData ? '있음' : '없음');
      
      if (!savedData) {
        console.error('❌ 계약서 데이터를 찾을 수 없습니다');
        
        // 디버깅: localStorage의 모든 키 출력
        console.log('📋 localStorage의 모든 키:', Object.keys(localStorage));
        
        showError(`계약서를 찾을 수 없습니다.<br><br>
          <strong>계약서 ID:</strong> ${contractId}<br>
          <strong>찾는 키:</strong> ${storageKey}<br><br>
          계약서 생성이 완료되었는지 확인해주세요.`);
        return;
      }
      
      contractData = JSON.parse(savedData);
      console.log('✅ 계약서 데이터 로드 성공:', contractData.employeeName);
      
      displayContract();
    } catch (error) {
      console.error('❌ 계약서 데이터 로드 오류:', error);
      showError('계약서 데이터를 불러오는 중 오류가 발생했습니다: ' + error.message);
    }
  }, 500);
}

function displayContract() {
  try {
    console.log('🖥️ 계약서 화면 표시 시작');
    
    // 로딩 숨기기
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    
    // 계약서 내용 채우기
    document.getElementById('previewCompanyName').textContent = contractData.companyName || '-';
    document.getElementById('previewEmployeeName').textContent = contractData.employeeName || '-';
    document.getElementById('previewName').textContent = contractData.employeeName || '-';
    document.getElementById('previewBirth').textContent = contractData.employeeBirth || '-';
    document.getElementById('previewAddress').textContent = contractData.employeeAddress || '-';
    document.getElementById('previewPhone').textContent = contractData.employeePhone || '-';
    
    document.getElementById('previewCompany').textContent = contractData.companyName || '-';
    document.getElementById('previewCEO').textContent = contractData.companyCEO || '-';
    document.getElementById('previewBusinessNumber').textContent = contractData.companyBusinessNumber || '-';
    document.getElementById('previewCompanyPhone').textContent = contractData.companyPhone || '-';
    document.getElementById('previewCompanyAddress').textContent = contractData.companyAddress || '-';
    
    document.getElementById('previewStartDate').textContent = contractData.startDate || '-';
    document.getElementById('previewEndDate').textContent = contractData.endDate || '기간의 정함이 없음';
    document.getElementById('previewStore').textContent = contractData.workStore || '-';
    document.getElementById('previewPosition').textContent = contractData.position || '-';
    document.getElementById('previewWorkDays').textContent = contractData.workDays || '-';
    document.getElementById('previewWorkTime').textContent = contractData.workTime || '-';
    document.getElementById('previewBreakTime').textContent = contractData.breakTime || '-';
    document.getElementById('previewWageType').textContent = contractData.wageType || '-';
    document.getElementById('previewWageAmount').textContent = contractData.wageAmount || '-';
    document.getElementById('previewPaymentDay').textContent = contractData.paymentDay || '-';
    document.getElementById('previewPaymentMethod').textContent = contractData.paymentMethod || '-';
    document.getElementById('previewContractBody').textContent = contractData.contractContent || '';
    document.getElementById('previewContractDate').textContent = contractData.contractDate || '';
    
    // 서명자 정보
    document.getElementById('signerName').textContent = contractData.employeeName || '-';
    document.getElementById('signerBirth').textContent = contractData.employeeBirth || '-';
    
    console.log('✅ 계약서 화면 표시 완료');
  } catch (error) {
    console.error('❌ 계약서 화면 표시 오류:', error);
    showError('계약서를 화면에 표시하는 중 오류가 발생했습니다: ' + error.message);
  }
}

function showError(message) {
  console.error('🚫 에러 표시:', message);
  document.getElementById('loadingSection').style.display = 'none';
  document.getElementById('errorSection').style.display = 'block';
  document.getElementById('errorMessage').innerHTML = message;
}

// ===================================================================
// 서명 패드
// ===================================================================

function initSignaturePad() {
  try {
    console.log('🎨 서명 패드 초기화 시작');
    
    canvas = document.getElementById('signaturePad');
    if (!canvas) {
      console.error('❌ 서명 패드 캔버스를 찾을 수 없습니다');
      return;
    }
    
    ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 마우스 이벤트
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // 터치 이벤트 (모바일)
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    console.log('✅ 서명 패드 초기화 완료');
  } catch (error) {
    console.error('❌ 서명 패드 초기화 오류:', error);
  }
}

function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  hasSignature = true;
}

function draw(e) {
  if (!isDrawing) return;
  
  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSignature = false;
}

// ===================================================================
// 서명 제출
// ===================================================================

function submitSignature() {
  // 동의 체크 확인
  const agreeCheck = document.getElementById('agreeCheck');
  if (!agreeCheck.checked) {
    alert('⚠️ 계약서 내용에 동의해주세요.');
    return;
  }
  
  // 서명 확인
  if (!hasSignature) {
    alert('⚠️ 서명을 그려주세요.');
    return;
  }
  
  // 서명 이미지 데이터
  const signatureData = canvas.toDataURL('image/png');
  
  // 서명 데이터 저장 (실제로는 서버에 전송)
  const signedContract = {
    ...contractData,
    signature: signatureData,
    signedAt: new Date().toISOString(),
    status: 'signed'
  };
  
  // localStorage에 저장 (임시)
  const signedContracts = JSON.parse(localStorage.getItem('signedContracts') || '[]');
  signedContracts.push(signedContract);
  localStorage.setItem('signedContracts', JSON.stringify(signedContracts));
  
  // 성공 메시지 표시
  showSuccess();
}

function showSuccess() {
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('successSection').style.display = 'block';
  document.getElementById('successContractId').textContent = contractId;
  
  // 상단으로 스크롤
  window.scrollTo(0, 0);
}
