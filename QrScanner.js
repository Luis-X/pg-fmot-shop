/**
 * 支持 React 及 HTML 调用的 H5 扫码组件
 */
class QrScanner {
    constructor(options = {}) {
        this.containerId = options.containerId || "app";
        this.onScanSuccess = options.onScanSuccess || null;
        this.onClose = options.onClose || null;

        this.html5QrCode = null;
        this.cameras = [];
        this.isScanningActive = false;

        this._initDOM();
        this._initScanner();
    }

    _initDOM() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div id="qr-reader-video"></div>
            <div class="qr-top-controls">
                <select id="qr-cameraSelect" disabled>
                    <option value="">加载中...</option>
                </select>
                <button id="qr-closeBtn" class="qr-close-btn">关闭</button>
            </div>
            <div id="qr-result">将二维码放入框内，即可自动扫描</div>
        `;

        if (!document.getElementById('qr-scanner-styles')) {
            const style = document.createElement('style');
            style.id = 'qr-scanner-styles';
            style.innerHTML = `
                #${this.containerId} {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    overflow: hidden; background-color: #000; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    box-sizing: border-box; z-index: 999;
                }
                #${this.containerId} * { box-sizing: border-box; }
                #qr-reader-video {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background: #000;
                }
                #qr-reader-video video {
                    width: 100% !important; height: 100% !important; object-fit: cover !important; border: none !important;
                }
                #qr-reader-video__dashboard_section_csr button,
                #qr-reader-video__dashboard_section_csr span,
                #qr-reader-video__header_message { display: none !important; }

                .qr-top-controls {
                    position: absolute; top: 20px; left: 20px; right: 20px; z-index: 10;
                    display: flex; align-items: center; gap: 10px;
                }
                #${this.containerId} select {
                    flex: 1;
                    padding: 10px 14px; font-size: 14px; font-weight: 500;
                    border: none; border-radius: 8px;
                    background-color: rgba(0, 0, 0, 0.6); color: white;
                    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    cursor: pointer; outline: none;
                    text-overflow: ellipsis;
                }
                #qr-cameraSelect option { background-color: #333; color: white; }
                #${this.containerId} select:disabled {
                    background-color: rgba(0, 0, 0, 0.3); color: #aaa; cursor: not-allowed;
                }
                .qr-close-btn {
                    padding: 10px 16px; font-size: 14px; font-weight: 500;
                    border: none; border-radius: 8px;
                    background-color: rgba(255, 59, 48, 0.8); color: white;
                    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    cursor: pointer; outline: none; white-space: nowrap;
                }
                .qr-close-btn:active { background-color: rgba(255, 59, 48, 1); }

                #qr-result {
                    position: absolute; bottom: 30px; left: 20px; right: 20px; z-index: 10;
                    padding: 15px; background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    border-radius: 12px; color: white; font-size: 14px;
                    word-break: break-all; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
            `;
            document.head.appendChild(style);
        }

        document.getElementById('qr-cameraSelect').addEventListener('change', (e) => this._handleCameraChange(e.target.value));
        document.getElementById('qr-closeBtn').addEventListener('click', () => {
            if (typeof this.onClose === 'function') {
                this.onClose();
            } else {
                this.destroy();
            }
        });
    }

    _initScanner() {
        const qrConfig = {};
        this.html5QrCode = new Html5Qrcode("qr-reader-video", qrConfig);
        this._initCameras();
    }

    async _initCameras() {
        try {
            this.cameras = await Html5Qrcode.getCameras();
            const selectElem = document.getElementById('qr-cameraSelect');
            if (!selectElem) return;

            selectElem.innerHTML = '';
            if (this.cameras && this.cameras.length > 0) {
                this.cameras.forEach((cam, index) => {
                    const option = document.createElement('option');
                    option.value = cam.id;
                    option.text = cam.label || `摄像头 ${index + 1}`;
                    selectElem.appendChild(option);
                });
                selectElem.disabled = false;

                let rearCamera = this.cameras.find(cam => 
                    cam.label.toLowerCase().includes('back') || 
                    cam.label.toLowerCase().includes('rear') || 
                    cam.label.toLowerCase().includes('后')
                );
                let defaultCameraId = rearCamera ? rearCamera.id : this.cameras[0].id;
                selectElem.value = defaultCameraId;
                await this.start(defaultCameraId);
            } else {
                selectElem.innerHTML = '<option value="">无设备</option>';
                this._setResultText("错误：未检测到可用的摄像头设备。");
            }
        } catch (err) {
            console.error("获取摄像头列表失败: ", err);
            this._setResultText("错误：无法访问摄像头，请检查 HTTPS 权限。");
        }
    }

    async start(cameraId) {
        try {
            if (this.html5QrCode && this.html5QrCode.isScanning) {
                await this.html5QrCode.stop();
            }

            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            await this.html5QrCode.start(
                cameraId, 
                config,
                (decodedText, decodedResult) => {
                    this._setResultText(`扫码成功：${decodedText}`);
                    if (navigator.vibrate) navigator.vibrate(200);
                    if (typeof this.onScanSuccess === 'function') {
                        this.onScanSuccess(decodedText, decodedResult);
                    }
                },
                (errorMessage) => {}
            );

            this.isScanningActive = true;
        } catch (err) {
            console.error("启动摄像头失败: ", err);
            this.isScanningActive = false;
        }
    }

    async stop() {
        try {
            if (this.html5QrCode && this.html5QrCode.isScanning) {
                await this.html5QrCode.stop();
            }
            this.isScanningActive = false;
        } catch (err) {
            console.error("停止扫码失败: ", err);
        }
    }

    async _handleCameraChange(cameraId) {
        if (!this.isScanningActive) return;
        await this.start(cameraId);
    }

    _setResultText(text) {
        const resultElem = document.getElementById('qr-result');
        if (resultElem) {
            resultElem.innerText = text;
        }
    }

    async destroy() {
        await this.stop();
        if (this.html5QrCode) {
            try {
                await this.html5QrCode.clear();
            } catch (e) {}
        }
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

// ==================== 全局便捷一行调用封装 ====================
window.openQrScanner = function(options = {}) {
    let modal = document.getElementById('global-qr-scanner-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'global-qr-scanner-modal';
        document.body.appendChild(modal);
    }
    modal.style.display = 'block';

    let scanner = null;
    scanner = new QrScanner({
        containerId: 'global-qr-scanner-modal',
        onScanSuccess: (text, result) => {
            if (options.onSuccess) options.onSuccess(text, result);
            scanner.destroy();
            modal.style.display = 'none';
        },
        onClose: () => {
            if (options.onClose) options.onClose();
            scanner.destroy();
            modal.style.display = 'none';
        }
    });
    return scanner;
};