/**
 * Types of DC motor control
 */
enum DCmotion {
	//% block= Forward
	Forward,
	//% block= Backward
	Backward,
	//% block= Brake
	Brake,
	//% block= Coast
	Coast
}

enum connectorDCMotor {
	//% block= M1
	M1,
	//% block= M2
	M2
}

enum connectorServoMotor {
	//% block= P13
	P13 = AnalogPin.P13,
	//% block= P14
	P14 =  AnalogPin.P14,
	//% block= P15
	P15 =  AnalogPin.P15
}

/**
 * ArtecRobo control package
 */
//% color=190 weight=100 icon="\uf009" block="ArtecRobo"
namespace artecrobo {

	/* spped initial value */
	let speedM1 = 1023;
	let speedM2 = 1023;
	let state = DCmotion.Brake;

	// Move DC motor
	//% blockId=artec_move_dc_motor
	//% block="Set DC motor %connector|to %motion"
	export function moveDCMotor(connector: connectorDCMotor, motion: DCmotion): void {
		switch(motion) {
			case DCmotion.Forward:
				/*
					Move Forward
					M1:P8 = speed, P12 = 0
					M2:P0 = speed, P16 = 0
				*/
				if (connector == connectorDCMotor.M1) {
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
				if (connector == connectorDCMotor.M1) {
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
				if (connector == connectorDCMotor.M1) {
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
				if (connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 0);
					pins.digitalWritePin(DigitalPin.P12, 0);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 0);
					pins.digitalWritePin(DigitalPin.P16, 0);
				}
				break;
		}
		state = motion;
	}

	//% blockId=artec_set_speed_dc_motor
	//% block="Set DC motor %connector| speed as %speed"
	//% speed.min=0 speed.max= 1023
	export function setSpeedDCMotor(connector: connectorDCMotor, speed: number): void {
		if (connector == connectorDCMotor.M1) {
			speedM1 = 1023 - speed;
		} else {
			speedM2 = 1023 - speed;
		}
		if (state == DCmotion.Forward || state == DCmotion.Backward) {
			moveDCMotor(connector, state);
		}
	}


	let angleP13 = 0;
	let angleP14 = 0;
	let angleP15 = 0;
	//% blockId=artec_move_servo_motor
	//% block="Move Serve Motor %connector| angle as %angle"
	//% speed.min=0 speed.max= 1023
	export function moveServoMotor(connector: connectorServoMotor, angle: number): void {
		switch (connector) {
			case connectorServoMotor.P13:
		 		pins.servoWritePin(AnalogPin.P13, angle);
		 		angleP13 = angle;
		 		break;
			case connectorServoMotor.P14:
		 		pins.servoWritePin(AnalogPin.P14, angle);
		 		angleP14 = angle;
		 		break;
			case connectorServoMotor.P15:
		 		pins.servoWritePin(AnalogPin.P15, angle);
		 		angleP15 = angle;
		 		break;
		 	default:
		 		break;
		}
	}

	/**
	 * Move Servo Motor Async.
	 */
    //% weight=84
    //% blockId=artec_async_move_servo_motor
    //% block="Move Servo motor asynchronous| speed as %_speed |Servo motor P13 set angle as %_angle13 |Servo motor P13 set angle as %_angle14 |Servo motor P13 set angle as %_angle15"
    //% _speed.min=1 _speed.max=20
    //% _angle13.min=0 _angle13.max=180
    //% _angle14.min=0 _angle14.max=180
    //% _angle15.min=0 _angle15.max=180
	export function AsyncMoveServoMotor(_speed: number
										,  _angle13: number
										,  _angle14: number
										, _angle15: number): void {

		let interval = Math.abs(_speed - 20) + 3;
		// サーボモーターを動かす方向
		let dirP13 = 1;
		let dirP14 = 1;
		let dirP15 = 1;
		if(_angle13 - angleP13 < 0) {
			dirP13 = -1;
		}

		if(_angle14 - angleP14 < 0) {
			dirP14 = -1;
		}

		if(_angle15 - angleP15 < 0) {
			dirP15 = -1;
		}

		let diffP13 = Math.abs(_angle13 - angleP13);	// 変化量
		let diffP14 = Math.abs(_angle14 - angleP14);	// 変化量
		let diffP15 = Math.abs(_angle15 - angleP15);	// 変化量
	    let maxData = Math.max(diffP13, diffP14);
	    maxData = Math.max(maxData, diffP15);

	    let divideP13 = 0;
	    let divideP14 = 0;
	    let divideP15 = 0;

	    if (diffP13 != 0) {
			let divideP13 = maxData / diffP13;	// 1度変化させる間隔
	    }
	    if (diffP14 != 0) {
			let divideP14 = maxData / diffP14;	// 1度変化させる間隔
	    }
	    if (diffP15 != 0) {
			let divideP15 = maxData / diffP15;	// 1度変化させる間隔
		}

		for(let i = 0; i <= maxData; i++ ) {
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
