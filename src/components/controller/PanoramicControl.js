/**
 * @author yaniky
 * @description 全景控制机
 */
import { Vector3 } from "three";

export class PanoramicControl {
    /**
     * @param {camera: Camera, tag: domElement, maxForward: number, sensitivity: number} options
     */
    constructor(options) {
        if (!options.camera) {
            throw new Error("camera is necessary");
        }
        this.defaultOptions = {
            tag: document,
            sensitivity: 1, // 灵敏度
            basePoint: new Vector3(0, 0, 0), // 原点
            baseDirection: new Vector3(0, 0, -1),
            maxMove: 100 // 最大移动距离
        };
        this._options = Object.assign(this.defaultOptions, options);
        this.movePer = 1; // 每次移动距离
        this.rotatePer = 0.01; // 每次旋转角度
        this.minDis = 0.5;
        this.mouseState = {
            mousePosition: {
                x: null,
                y: null
            },
            isDown: false
        };
        this.rotateAngle = {
            y: 0, // 绕y轴旋转，与z轴角度
            xz: 0 // 与xz面夹角
        };

        this._initCamero();
        this._addMouseWheelEvent();
        this._addMouseMoveEvent();
    }

    /**
     * 初始化相机属性
     */
    _initCamero() {
        this._options.camera.position.x = this._options.basePoint.x;
        this._options.camera.position.y = this._options.basePoint.y;
        this._options.camera.position.z = this._options.basePoint.z + this.minDis;
        this._options.camera.up.x = 0;
        this._options.camera.up.y = 1;
        this._options.camera.up.z = 0;
        this._options.camera.rotation.x = 0;
        this._options.camera.rotation.y = 0;
        this._options.camera.rotation.z = 0;
        this._options.camera.lookAt(this._options.baseDirection);
    }

    /**
     * 鼠标滚动相机前后移动
     */
    _addMouseWheelEvent() {
        this._options.tag.addEventListener("mousewheel", (event) => {
            const e = event || window.event;

            if (e.wheelDelta) {
                if (e.wheelDelta > 0) {
                    this._cameraForward();
                }
                if (e.wheelDelta < 0) {
                    this._cameraBackOff();
                }
            } else if (e.detail) {
                if (e.detail> 0) {
                    this._cameraForward();
                }
                if (e.detail< 0) {
                    this._cameraBackOff();
                }
            }
        });
    }

    /**
     * 鼠标滚动相机转动
     */
    _addMouseMoveEvent() {
        this._options.tag.addEventListener("mouseup", () => {
            this.mouseState.isDown = false;
        });
        this._options.tag.addEventListener("mousedown", (e) => {
            this.mouseState.mousePosition = {
                x: e.pageX,
                y: e.pageY
            };
            this.mouseState.isDown = true;
        });
        this._options.tag.addEventListener("mousemove", (e) => {
            if (this.mouseState.isDown) {
                const moveX = e.pageX - this.mouseState.mousePosition.x,
                    moveY = e.pageY - this.mouseState.mousePosition.y,

                    rotateBase = this.rotatePer * this._options.sensitivity,
                    rotateByY = -1 * rotateBase * moveX, // 基于y轴旋转角度
                    rotateByXZ = rotateBase * moveY; // 基于xz面旋转角度

                this._rotate(rotateByY, rotateByXZ);

                this.mouseState.mousePosition = {
                    x: e.pageX,
                    y: e.pageY
                };
            }
        });
    }

    /**
     * 绕y轴旋转与z轴新角度
     * @param {number} angle
     * @returns {number}
     */
    _nextAngleY(angle) {
        let totalAngle = this.rotateAngle.y + angle;

        if (totalAngle >= 2 * Math.PI) {
            totalAngle = totalAngle - 2 * Math.PI;
        } else if (totalAngle <= -(2 * Math.PI)) {
            totalAngle = totalAngle + 2 * Math.PI;
        }
        this.rotateAngle.y = totalAngle;
        return totalAngle;
    }

    /**
     * 旋转后与xz面新角度
     * @param {number} angle
     * @returns {number}
     */
    _nextAngleXZ(angle) {
        let totalAngle = this.rotateAngle.xz + angle;

        if (totalAngle >= Math.PI / 2) {
            totalAngle = Math.PI / 2;
        }
        if (totalAngle <= -1 * Math.PI / 2) {
            totalAngle = -1 * Math.PI / 2;
        }
        this.rotateAngle.xz = totalAngle;
        return totalAngle;
    }

    /**
     * 旋转
     * @param {number} angle
     */
    _rotate(angleY, angleXZ) {
        const dis = this._disFormBase(),

            newAngleY = this._nextAngleY(angleY),
            newAngleXZ = this._nextAngleXZ(angleXZ);

        if (dis === 0) {
            // 异常处理
            this._initCamero();
        }

        const newY = Math.sin(newAngleXZ) * dis;
        const XZ = Math.cos(newAngleXZ) * dis;
        const newX = Math.sin(newAngleY) * XZ;
        const newZ = Math.cos(newAngleY) * XZ;

        this._options.camera.position.x = this._options.basePoint.x + newX;
        this._options.camera.position.y = this._options.basePoint.y + newY;
        this._options.camera.position.z = -1 * (this._options.basePoint.z + newZ);
        this._resetCameraLookAt();
    }


    /**
     * 校准camera朝向
     */
    _resetCameraLookAt() {
        this._options.camera.lookAt(
            new Vector3(
                2 * (this._options.camera.position.x - this._options.basePoint.x),
                2 * (this._options.camera.position.y - this._options.basePoint.y),
                2 * (this._options.camera.position.z - this._options.basePoint.z)
            )
        );
    }

    /**
     * 距离原点距离
     * @returns {number}
     */
    _disFormBase() {
        return this._options.basePoint.distanceTo(this._options.camera.position);
    }


    /**
     * 相机向前移动
     */
    _cameraForward() {
        const direction = this._options.camera.getWorldDirection(),
            constant = this.movePer * this._options.sensitivity,
            newX = this._options.camera.position.x + direction.x * constant,
            newY = this._options.camera.position.y + direction.y * constant,
            newZ = this._options.camera.position.z + direction.z * constant,
            moveDis2 =
            (newX - this._options.basePoint.x) * (newX - this._options.basePoint.x) +
            (newY - this._options.basePoint.y) * (newY - this._options.basePoint.y) +
            (newZ - this._options.basePoint.z) * (newZ - this._options.basePoint.z);

        if (this._options.maxMove * this._options.maxMove > moveDis2) {
            this._options.camera.position.x = newX;
            this._options.camera.position.y = newY;
            this._options.camera.position.z = newZ;
        }
    }

    /**
     * 相机向后移动
     */
    _cameraBackOff() {
        const direction = this._options.camera.getWorldDirection(),
            constant = this.movePer * this._options.sensitivity,
            newX = this._options.camera.position.x - direction.x * constant,
            newY = this._options.camera.position.y - direction.y * constant,
            newZ = this._options.camera.position.z - direction.z * constant;

        if (this._disFormBase() >= this.minDis &&
            this._isDirectionSame(direction,
                new Vector3(
                    newX - this._options.basePoint.x,
                    newY - this._options.basePoint.y,
                    newZ - this._options.basePoint.z,
                )
            )) {
            this._options.camera.position.x = newX;
            this._options.camera.position.y = newY;
            this._options.camera.position.z = newZ;
        } else {
            this._options.camera.position.x = this._options.basePoint.x;
            this._options.camera.position.y = this._options.basePoint.y;
            this._options.camera.position.z = this._options.basePoint.z + this.minDis;
        }
    }

    /**
     * 判断两个相量是否同向
     * @param {Vector3} dir1
     * @param {Vector3} dir2
     * @returns {boolean}
     */
    _isDirectionSame(dir1, dir2) {
        return dir1.angleTo(dir2) <= 1;
    }
}