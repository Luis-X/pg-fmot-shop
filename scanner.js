import { Html5Qrcode, Html5QrcodeScannerState } from 'https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/+esm'

let scanner = null
let resolveRef = null
let rejectRef = null
let currentCameraId = null
const MODAL_ID = 'qr_fullscreen_modal'

export async function closeHtml5Scanner() {
  if (scanner) {
    try {
      const state = scanner.getState()
      if (
        state === Html5QrcodeScannerState.SCANNING || 
        state === Html5QrcodeScannerState.PAUSED
      ) {
        await scanner.stop()
      }
      await scanner.clear()
    } catch (e) {
      console.warn('Failed to stop scanner:', e)
    } finally {
      scanner = null
    }
  }

  const modal = document.getElementById(MODAL_ID)
  if (modal) modal.remove()

  if (rejectRef) {
    rejectRef(new Error('USER_CANCELLED'))
    rejectRef = null
    resolveRef = null
  }
}

function buildModal() {
  const existingModal = document.getElementById(MODAL_ID)
  if (existingModal) existingModal.remove()

  const wrap = document.createElement('div')
  wrap.id = MODAL_ID
  wrap.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `

  wrap.innerHTML = `
    <style>
      #${MODAL_ID} #reader-container {
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        position: relative;
      }
      #${MODAL_ID} video {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      #${MODAL_ID}__dashboard_section_csr {
        display: none !important;
      }
      .scan-top-controls {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        z-index: 10;
        display: flex;
        align-items: center;
      }
      .scan-top-controls select {
        width: 100%;
        padding: 10px 14px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        cursor: pointer;
        outline: none;
        text-overflow: ellipsis;
      }
      .scan-top-controls select option {
        background-color: #333;
        color: white;
      }
      .scan-top-controls select:disabled {
        background-color: rgba(0, 0, 0, 0.3);
        color: #aaa;
        cursor: not-allowed;
      }
    </style>
    
    <div class="scan-top-controls">
      <select id="scan-cameraSelect" disabled>
        <option value="">加载设备...</option>
      </select>
    </div>

    <div id="reader-container"></div>
    
    <button id="btn-close-scan" style="
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 36px;
      background: rgba(255, 59, 48, 0.8);
      color: #fff;
      border: none;
      border-radius: 24px;
      font-size: 16px;
      backdrop-filter: blur(4px);
      cursor: pointer;
      z-index: 10;
    ">关闭扫码</button>
  `

  document.body.appendChild(wrap)
  document.getElementById('btn-close-scan').onclick = closeHtml5Scanner
}

async function startScanning(cameraId) {
  const qrBoxSize = 250
  if (scanner.isScanning) {
    await scanner.stop()
  }

  await scanner.start(
    cameraId,
    {
      fps: 10,
      qrbox: { width: qrBoxSize, height: qrBoxSize },
      aspectRatio: window.innerWidth / window.innerHeight
    },
    (resultText) => {
      const tempResolve = resolveRef
      resolveRef = null
      rejectRef = null
      closeHtml5Scanner()
      if (tempResolve) tempResolve(resultText)
    },
    () => {}
  )
}

export async function openCameraScan() {
  await closeHtml5Scanner()

  return new Promise(async (resolve, reject) => {
    resolveRef = resolve
    rejectRef = reject
    buildModal()
    
    const readerDomId = 'reader-container'
    scanner = new Html5Qrcode(readerDomId, {
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true
      }
    })

    try {
      const cameras = await Html5Qrcode.getCameras()
      const selectElem = document.getElementById('scan-cameraSelect')
      
      if (selectElem && cameras && cameras.length > 0) {
        selectElem.innerHTML = ''
        cameras.forEach((cam, index) => {
          const option = document.createElement('option')
          option.value = cam.id
          option.text = cam.label || `摄像头 ${index + 1}`
          selectElem.appendChild(option)
        })
        selectElem.disabled = false

        let rearCamera = cameras.find(cam => 
          cam.label.toLowerCase().includes('back') || 
          cam.label.toLowerCase().includes('rear') || 
          cam.label.toLowerCase().includes('后')
        )
        currentCameraId = rearCamera ? rearCamera.id : cameras[0].id
        selectElem.value = currentCameraId

        selectElem.onchange = async (e) => {
          currentCameraId = e.target.value
          try {
            await startScanning(currentCameraId)
          } catch (err) {
            console.error("切换摄像头失败", err)
          }
        }
      } else if (selectElem) {
        selectElem.innerHTML = '<option value="">无可用设备</option>'
      }

      if (currentCameraId) {
        await startScanning(currentCameraId)
      } else {
        throw new Error('NOT_SUPPORT_CAMERA')
      }

    } catch (error) {
      resolveRef = null
      rejectRef = null
      closeHtml5Scanner()
      const errMsg = String(error || '')
      if (errMsg.toLowerCase().includes('camera streaming not supported')) {
        reject(new Error('NOT_SUPPORT_CAMERA'))
      } else {
        reject(error)
      }
    }
  })
}

// 核心：直接挂载到全局 window 对象上，实现极简调用
window.$scan = {
  open: openCameraScan,
  close: closeHtml5Scanner
};