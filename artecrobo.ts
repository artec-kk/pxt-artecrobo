/**
 * Types of DC motor control
 */
enum DCmotion {
	//% block="Forward"
	Forward,
	//% block="Backward"
	Backward,
	//% block="Brake"
	Brake,
	//% block="Coast"
	Coast
}

enum connectorDCMotor {
	//% block="M1"
	M1,
	//% block="M2"
	M2
}

enum connectorServoMotor {
	//% block="P13"
	P13 = AnalogPin.P13,
	//% block="P14"
	P14 = AnalogPin.P14,
	//% block="P15"
	P15 = AnalogPin.P15
}

/**
 * ArtecRobo control package
 */
//% color=#5b99a5 weight=100 icon="\uf009" block="ArtecRobo"
namespace artecrobo {

	/* spped initial value */
	let speedM1 = 1023;
	let speedM2 = 1023;
	let state = DCmotion.Brake;

	// Move DC motor
	//% blockId=artec_move_dc_motor
	//% block="DC motor %_connector| motion: %_motion"
	export function moveDCMotor(_connector: connectorDCMotor, _motion: DCmotion): void {
		switch(_motion) {
			case DCmotion.Forward:
				/*
					Move Forward
					M1:P8 = speed, P12 = 0
					M2:P0 = speed, P16 = 0
				*/
				if (_connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 1);
					pins.analogWritePin(AnalogPin.P12, speedM1);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 1);
					pins.analogWritePin(AnalogPin.P16, speedM2);
				}
				break;
			case DCmotion.Backward:
				/*
					Move Backward
					M1:P8 = 0, P12 = speeed
					M2:P0 = 0, P16 = speeed
				*/
				if (_connector == connectorDCMotor.M1) {
					pins.analogWritePin(AnalogPin.P8, speedM1);
					pins.digitalWritePin(DigitalPin.P12, 1);
				} else {
					pins.analogWritePin(AnalogPin.P0, speedM2);
					pins.digitalWritePin(DigitalPin.P16, 1);
				}
				break;
			case DCmotion.Brake:
				/*
					Brake
					M1:P8 = 1, P12 = 1
					M2:P0 = 1, P16 = 1
				*/
				if (_connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 1);
					pins.digitalWritePin(DigitalPin.P12, 1);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 1);
					pins.digitalWritePin(DigitalPin.P16, 1);
				}
				break;
			case DCmotion.Coast:
				/*
					Coast
					M1:P8 = 0, P12 = 0
					M2:P0 = 0, P16 = 0
				*/
				if (_connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 0);
					pins.digitalWritePin(DigitalPin.P12, 0);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 0);
					pins.digitalWritePin(DigitalPin.P16, 0);
				}
				break;
		}
		state = _motion;
	}

	//% blockId=artec_set_speed_dc_motor
	//% block="DC motor %_connector| speed: %_speed"
	//% _speed.min=0 _speed.max=1023
	export function setSpeedDCMotor(_connector: connectorDCMotor, _speed: number): void {
		if (_speed < 0)		{ _speed = 0; }
		if (_speed > 1023)	{ _speed = 1023; }
		if (_connector == connectorDCMotor.M1) {
			speedM1 = 1023 - _speed;
		} else {
			speedM2 = 1023 - _speed;
		}
		if (state == DCmotion.Forward || state == DCmotion.Backward) {
			moveDCMotor(_connector, state);
		}
	}
	let angleP13 = 90;
	let angleP14 = 90;
	let angleP15 = 90;
	pins.servoWritePin(AnalogPin.P13, angleP13);
	pins.servoWritePin(AnalogPin.P14, angleP14);
	pins.servoWritePin(AnalogPin.P15, angleP15);

	//% blockId=artec_move_servo_motor_max
	//% block="move servo pin %_connector| to (degrees) %_angle"
	//% _angle.min=0 _angle.max=180
	export function moveServoMotorMax(_connector: connectorServoMotor, _angle: number): void {
		if (_angle < 0)		{ _angle = 0; }
		if (_angle > 180)	{ _angle = 180; }
		switch (_connector) {
			case connectorServoMotor.P13:
				pins.servoWritePin(AnalogPin.P13, _angle);
				angleP13 = _angle;
				break;
			case connectorServoMotor.P14:
				pins.servoWritePin(AnalogPin.P14, _angle);
				angleP14 = _angle;
				break;
			case connectorServoMotor.P15:
				pins.servoWritePin(AnalogPin.P15, _angle);
				angleP15 = _angle;
				break;
			default:
				break;
		}
	}

	//% blockId=artec_move_servo_motor
	//% block="move servo pin %_connector| to (degrees) %_angle| speed: %_speed"
	//% _angle.min=0 _angle.max=180
	//% _speed.min=0 _speed.max=20
	export function moveServoMotor(_connector: connectorServoMotor, _angle: number, _speed: number): void {
		if (_speed < 1)		{ _speed = 1; }
		if (_speed > 20)	{ _speed = 20; }
		if (_angle < 0)		{ _angle = 0; }
		if (_angle > 180)	{ _angle = 180; }
		switch (_connector) {
			case connectorServoMotor.P13:
				moveservo(AnalogPin.P13, angleP13, _angle, _speed);
				angleP13 = _angle;
				break;
			case connectorServoMotor.P14:
				moveservo(AnalogPin.P14, angleP14, _angle, _speed);
				angleP14 = _angle;
				break;
			case connectorServoMotor.P15:
				moveservo(AnalogPin.P15, angleP15, _angle, _speed);
				angleP15 = _angle;
				break;
			default:
				break;
		}
	}

	function moveservo (_pin: AnalogPin, _FromAngle: number, _ToAngle: number, _speed: number): void {
		const diff = Math.abs(_ToAngle - _FromAngle );
		if (diff == 0) return;

		const interval = Math.abs(_speed - 20) + 3;
		let dir = 1;
		if(_ToAngle - _FromAngle < 0) {
			dir = -1;
		}
		for(let i = 1; i <= diff; i++ ) {
			_FromAngle = _FromAngle + dir;
			pins.servoWritePin(_pin, _FromAngle);
			basic.pause(interval);
		}
	}

	/**
	 * Move Servo Motor Async.
	 * @param speed speed
	 * @param angle13 ServoMotor Angle P13
	 * @param angle14 ServoMotor Angle P14
	 * @param angle15 ServoMotor Angle P15
	 */
	//% weight=84
	//% blockId=artec_async_move_servo_motor
	//% block="move servo synchronously | speed: %_speed| P13 (degrees): %_angle13| P14 (degrees): %_angle14 |P15 (degrees): %_angle15"
	//% _speed.min=1 _speed.max=20
	//% _angle13.min=0 _angle13.max=180
	//% _angle14.min=0 _angle14.max=180
	//% _angle15.min=0 _angle15.max=180
	export function AsyncMoveServoMotor(_speed: number,  _angle13: number,  _angle14: number, _angle15: number): void {
		if (_speed < 0)		{ _speed = 0; }
		if (_speed > 20)	{ _speed = 20; }
		if (_angle13 < 0)	{ _angle13 = 0; }
		if (_angle13 > 180)	{ _angle13 = 180; }
		if (_angle14 < 0)	{ _angle14 = 0; }
		if (_angle14 > 180)	{ _angle14 = 180; }
		if (_angle15 < 0)	{ _angle15 = 0; }
		if (_angle15 > 180)	{ _angle15 = 180; }
		const interval = Math.abs(_speed - 20) + 3;
		// サーボモーターを動かす方向
		let dirP13 = 1;
		if(_angle13 - angleP13 < 0) {
			dirP13 = -1;
		}

		let dirP14 = 1;
		if(_angle14 - angleP14 < 0) {
			dirP14 = -1;
		}

		let dirP15 = 1;
		if(_angle15 - angleP15 < 0) {
			dirP15 = -1;
		}

		const diffP13 = Math.abs(angleP13 - _angle13);    // 変化量
		const diffP14 = Math.abs(angleP14 - _angle14);    // 変化量
		const diffP15 = Math.abs(angleP15 - _angle15);    // 変化量
		let maxData = Math.max(diffP13, diffP14);
		maxData = Math.max(maxData, diffP15);

		let divideP13 = 0;
		if (diffP13 != 0) {
			divideP13 = maxData / diffP13;  // 1度変化させる間隔
		}

		let divideP14 = 0;
		if (diffP14 != 0) {
			divideP14 = maxData / diffP14;  // 1度変化させる間隔
		}

		let divideP15 = 0;
		if (diffP15 != 0) {
			divideP15 = maxData / diffP15;  // 1度変化させる間隔
		}

		for(let i = 1; i <= maxData; i++ ) {
			if (diffP13 != 0) {
				if( i % divideP13 == 0 ){
					angleP13 = angleP13 + dirP13;
					pins.servoWritePin(AnalogPin.P13, angleP13);
				}
			}
			if (diffP14 != 0) {
				if( i % divideP14 == 0 ){
					angleP14 = angleP14 + dirP14;
					pins.servoWritePin(AnalogPin.P14, angleP14);
				}
			}
			if (diffP15 != 0) {
				if( i % divideP15 == 0 ){
					angleP15 = angleP15 + dirP15;
					pins.servoWritePin(AnalogPin.P15, angleP15);
				}
			}
			basic.pause(interval);
		}
		// 最後に全部そろえる。
		angleP13 = _angle13;
		angleP14 = _angle14;
		angleP15 = _angle15;
		if (diffP13 != 0) pins.servoWritePin(AnalogPin.P13, angleP13);
		if (diffP14 != 0) pins.servoWritePin(AnalogPin.P14, angleP14);
		if (diffP15 != 0) pins.servoWritePin(AnalogPin.P15, angleP15);
	}
}
