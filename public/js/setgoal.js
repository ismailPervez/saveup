const setgoalform = document.querySelector('#set-goal-form');
const nameInput = setgoalform.querySelector('#name');
const amountInput = setgoalform.querySelector('#amount');
const frequencyInput = setgoalform.querySelector('#frequency');
const includeWeekendsInput = setgoalform.querySelector('#include-weekends');
const submitBtn = document.querySelector('#submit-set-goal-btn');

frequencyInput.addEventListener('change', (e) => {
    if (e.target.value !== 'Daily') {
        e.target.checked = false;
        includeWeekendsInput.setAttribute('disabled', 'true');
    }

    else {
        includeWeekendsInput.removeAttribute('disabled');
    }
});

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    console.log("Set new goal...");

    const data = {
        name: nameInput.value,
        amount: amountInput.value,
        frequency: frequencyInput.value,
        include_weekend: includeWeekendsInput.checked ? 1 : 0
    };

    const loader = e.target.querySelector('.spinner-border');
    loader.classList.remove('d-none');
    e.target.setAttribute('disabled', 'true');

    fetch('/savings/post', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            loader.classList.add('d-none');
            e.target.removeAttribute('disabled');
            if (data.status == 'success') {
                window.location.reload();
            }

            else {
                alert(data.message);
                // Close the modal
                $('#setgoalmodal').modal('hide');
            }
        })
});

$("#close-set-goal-modal").click(function () {
    $('#setgoalmodal').modal('hide');
});