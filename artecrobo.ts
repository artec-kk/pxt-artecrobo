/**
 * Types of DC motor control
 */
enum motion {
    //% block=banana
    Forward = 0,
    //% block=pineapple
    Backward = 1,
    //% block=coconut
    Stop = 2,
    //% block=coconut
    Release= 3
}

/**
 * ArtecRobo control package
 */
//% weight=70 icon="\uf1db" color=#EC7505
namespace artecrobo {
    // Move DC motor
    export function moveDCMotor(string: connector, string: motion): void {
		/*
			Move Forward
			M1:P6 = 1, P12 = 0
			M1:P0 = 1, P16 = 0

			Move Backward
			M1:P6 = 0, P12 = 1
			M1:P0 = 0, P16 = 1

			Stop
			M1:P6 = 1, P12 = 1
			M1:P0 = 1, P16 = 1

			Release
			M1:P6 = 0, P12 = 0
			M1:P0 = 0, P16 = 0
		*/
    	var array: M1[] = ["P6", "P12"];
    	var array: M2[] = ["P0", "P16"];
    	/* Forward, Backward, Stop, Release*/
    	var array:control[][] = [[1,0], [0,1], [1,1], [0,0]];

    	var motionCode = -1;
    	switch(motion) {
    		case "Forward":
    			motionCode = 0;
    			break;
    		case "Backward":
    			motionCode = 1;
    			break;
    		case "Stop":
    			motionCode = 2;
    			break;
    		case "Release":
    			motionCode = 3;
    			break;
    	}
    	if (motionCode < 0 ) return;
    	if (connector = "M1") {
			digitalWritePin(M1[0], control[motionCode][0]);
			digitalWritePin(M1[1], control[motionCode][1]);
    	} else {
			digitalWritePin(M2[0], control[motionCode][0]);
			digitalWritePin(M2[1], control[motionCode][1]);
    	}
    }

    // Move DC motor
    export function setSpeedDCMotor(string: pin, int: speed): void {
		digitalWritePin(name: DigitalPin, value: number);
    }

    // Sync servo motor
    export function moveServoMotorSync(string: pin, int: speed): void {
		digitalWritePin(name: DigitalPin, value: number);
    }
}
