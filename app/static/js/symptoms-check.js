const progress = (value) => {
    document.getElementsByClassName('progress-bar')[0].style.width = `${value}%`;
}

let step = document.getElementsByClassName('step');
let prevBtn = document.getElementById('prev-btn');
let nextBtn = document.getElementById('next-btn');
let submitBtn = document.getElementById('submit-btn');
let form = document.getElementsByTagName('form')[0];
let preloader = document.getElementById('preloader-wrapper');
let bodyElement = document.querySelector('body');
let succcessDiv = document.getElementById('success');

let riskLow = document.getElementById("risk-low");
let riskMedium = document.getElementById("risk-medium");
let riskHigh = document.getElementById("risk-high");

form.onsubmit = () => {
    return false
}

let current_step = 0;
let stepCount = step.length - 1;
step[current_step].classList.add('d-block');
if (current_step == 0) {
    prevBtn.classList.add('d-none');
    submitBtn.classList.add('d-none');
    nextBtn.classList.add('d-inline-block');
}

function calculate_risk() {
    let risk = 0;
    document.getElementsByName("q_1").forEach((q) => {
        if (q.checked) {
            risk += parseInt(q.value);
        }
    });

    risk += document.getElementById("q_2_yes").checked ? 2 : 0;

    risk += document.getElementById("q_3_positive").checked ? 10 : 0;
    risk += document.getElementById("q_3_waiting").checked ? 2 : 0;
    risk += document.getElementById("q_3_untested").checked ? 2 : 0;

    return risk;
}


nextBtn.addEventListener('click', () => {
    current_step++;
    let previous_step = current_step - 1;
    if ((current_step > 0) && (current_step <= stepCount)) {
        prevBtn.classList.remove('d-none');
        prevBtn.classList.add('d-inline-block');
        step[current_step].classList.remove('d-none');
        step[current_step].classList.add('d-block');
        step[previous_step].classList.remove('d-block');
        step[previous_step].classList.add('d-none');
        if (current_step == stepCount) {
            //submitBtn.classList.remove('d-none');
            //submitBtn.classList.add('d-inline-block');
            nextBtn.classList.remove('d-inline-block');
            nextBtn.classList.add('d-none');
        }

        if (current_step == stepCount - 1) {
            let risk = calculate_risk();
            if (risk == 0) {
                riskLow.classList.remove('d-none');
                riskMedium.classList.add('d-none');
                riskHigh.classList.add('d-none');
            } else if (risk <= 2) {
                riskLow.classList.add('d-none');
                riskMedium.classList.remove('d-none');
                riskHigh.classList.add('d-none');
            } else {
                riskLow.classList.add('d-none');
                riskMedium.classList.add('d-none');
                riskHigh.classList.remove('d-none');
            }
        }
    } else {
        if (current_step > stepCount) {
            form.onsubmit = () => {
                return true
            }
        }
    }
    progress((100 / stepCount) * current_step);
});


prevBtn.addEventListener('click', () => {
    if (current_step > 0) {
        current_step--;
        let previous_step = current_step + 1;
        prevBtn.classList.add('d-none');
        prevBtn.classList.add('d-inline-block');
        step[current_step].classList.remove('d-none');
        step[current_step].classList.add('d-block')
        step[previous_step].classList.remove('d-block');
        step[previous_step].classList.add('d-none');
        if (current_step < stepCount) {
            submitBtn.classList.remove('d-inline-block');
            submitBtn.classList.add('d-none');
            nextBtn.classList.remove('d-none');
            nextBtn.classList.add('d-inline-block');
            prevBtn.classList.remove('d-none');
            prevBtn.classList.add('d-inline-block');
        }
    }

    if (current_step == 0) {
        prevBtn.classList.remove('d-inline-block');
        prevBtn.classList.add('d-none');
    }
    progress((100 / stepCount) * current_step);
});


submitBtn.addEventListener('click', () => {
    step[stepCount].classList.remove('d-block');
    step[stepCount].classList.add('d-none');
    prevBtn.classList.remove('d-inline-block');
    prevBtn.classList.add('d-none');
    submitBtn.classList.remove('d-inline-block');
    submitBtn.classList.add('d-none');
    succcessDiv.classList.remove('d-none');
    succcessDiv.classList.add('d-block');
});


function onTelegramAuth(user) {
    const params = {
        risk: calculate_risk(),
        id: user.id,
    };
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params)
    };

    fetch('/record', options)
        .then( response => {
            console.log(response);
            submitBtn.click();
        });
}