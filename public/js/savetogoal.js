const table = document.querySelector('table');

table.addEventListener('click', (e) => {
    if (e.target.classList.contains('save-to-goal-btn')) {
        const goalId = e.target.getAttribute('data-goal-id');
        goals.forEach(goal => {
            if (goal.id == goalId) {
                $('#savetogoalmodal .modal-title').text(`Save to goal - ${goal.name}`);
                $("#submit-save-to-goal-btn").attr('data-goal-id', goalId);
                $('#savetogoalmodal').modal('show');
            }
        })
    }
});


const submitSaveBtn = document.querySelector('#submit-save-to-goal-btn');
const savedAmountInput = document.querySelector('#savetogoalmodal #amount');

submitSaveBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const goalId = e.target.getAttribute('data-goal-id');
    const amount = savedAmountInput.value;

    const data = {
        goalId: goalId,
        amount: amount
    };

    const loader = e.target.querySelector('.spinner-border');
    loader.classList.remove('d-none');
    e.target.setAttribute('disabled', 'true');

    fetch('/savings/post', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
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
                $('#savetogoalmodal').modal('hide');
            }
        })
});

$("#close-save-to-goal-modal").click(function () {
    $('#savetogoalmodal').modal('hide');
});