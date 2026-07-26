/**
 * 支持 React 调用的 H5 扫码组件
 */
class QrScanner {
    constructor(options = {}) {
        this.containerId = options.containerId || "app";
        this.onScanSuccess = options.onScanSuccess || null;

        this.html5QrCode = null;
        this.cameras = [];
        this.isTorchOn = false;
        this.torchSupported = false;
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
                <button id="qr-torchBtn" disabled>闪光灯：关</button>
                <button id="qr-toggleBtn" class="qr-action-btn">关闭</button>
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
                #${this.containerId} select, #${this.containerId} button {
                    padding: 10px 14px; font-size: 14px; font-weight: 500;
                    border: none; border-radius: 8px;
                    background-color: rgba(0, 0, 0, 0.6); color: white;
                    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
                    cursor: pointer; outline: none;
                }
                #qr-cameraSelect { flex: 1; max-width: 40%; text-overflow: ellipsis; }
                #qr-cameraSelect option { background-color: #333; color: white; }
                #${this.containerId} button:active { background-color: rgba(0, 0, 0, 0.8); }
                #${this.containerId} button:disabled, #${this.containerId} select:disabled {
                    background-color: rgba(0, 0, 0, 0.3); color: #aaa; cursor: not-allowed;
                }
                .qr-action-btn { background-color: rgba(255, 59, 48, 0.8); }
                .qr-action-btn.start { background-color: rgba(52, 199, 89, 0.8); }

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
        document.getElementById('qr-torchBtn').addEventListener('click', () => this.toggleTorch());
        document.getElementById('qr-toggleBtn').addEventListener('click', () => this.toggleScannerState());
    }

    _initScanner() {
        const qrConfig = {
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
        };
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
            this._updateToggleBtnUI();
            this._checkTorchSupport();
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
            this._resetTorchState();
            this._updateToggleBtnUI();
        } catch (err) {
            console.error("停止扫码失败: ", err);
        }
    }

    async _handleCameraChange(cameraId) {
        if (!this.isScanningActive) return;
        this.isTorchOn = false;
        await this.start(cameraId);
    }

    async toggleTorch() {
        if (!this.torchSupported || !this.isScanningActive) return;
        try {
            await this.html5QrCode.applyVideoConstraints({
                advanced: [{ torch: !this.isTorchOn }]
            });
            this.isTorchOn = !this.isTorchOn;
            this._updateTorchBtnUI();
        } catch (err) {
            console.error("闪光灯控制失败", err);
        }
    }

    async toggleScannerState() {
        const selectElem = document.getElementById('qr-cameraSelect');
        if (this.isScanningActive) {
            await this.stop();
            this._setResultText("扫码已关闭，点击“开启”恢复");
        } else {
            const cameraId = selectElem.value;
            if (!cameraId) return;
            await this.start(cameraId);
            this._setResultText("将二维码放入框内，即可自动扫描");
        }
    }

    _checkTorchSupport() {
        try {
            const settings = this.html5QrCode.getRunningTrackSettings();
            const torchBtn = document.getElementById('qr-torchBtn');
            if (torchBtn && settings && typeof settings.torch === 'boolean') {
                this.torchSupported = true;
                torchBtn.disabled = false;
                this.isTorchOn = settings.torch;
                this._updateTorchBtnUI();
            } else {
                this._resetTorchState();
            }
        } catch (e) {
            this._resetTorchState();
        }
    }

    _resetTorchState() {
        this.torchSupported = false;
        this.isTorchOn = false;
        const torchBtn = document.getElementById('qr-torchBtn');
        if (torchBtn) {
            torchBtn.disabled = true;
            torchBtn.innerText = "闪光灯：不支持";
        }
    }

    _updateTorchBtnUI() {
        const torchBtn = document.getElementById('qr-torchBtn');
        if (torchBtn) {
            torchBtn.innerText = this.isTorchOn ? "闪光灯：开" : "闪光灯：关";
        }
    }

    _updateToggleBtnUI() {
        const btn = document.getElementById('qr-toggleBtn');
        if (!btn) return;
        if (this.isScanningActive) {
            btn.innerText = "关闭";
            btn.className = "qr-action-btn";
        } else {
            btn.innerText = "开启";
            btn.className = "qr-action-btn start";
        }
    }

    _setResultText(text) {
        const resultElem = document.getElementById('qr-result');
        if (resultElem) {
            resultElem.innerText = text;
        }
    }

    /**
     * React 组件销毁时调用的清理方法
     */
    async destroy() {
        await this.stop();
        if (this.html5QrCode) {
            try {
                await this.html5QrCode.clear();
            } catch (e) {}
        }
    }
}