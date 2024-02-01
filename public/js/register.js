const form = document.querySelector('form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        username: username.value,
        password: password.value
    };

    const loader = e.target.querySelector('.spinner-border');
    loader.classList.remove('d-none');
    e.target.setAttribute('disabled', true);

    fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        redirect: 'follow'
    })
        .then(response => response.json())
        .then(data => {
            loader.classList.add('d-none');
            e.target.removeAttribute('disabled');
            if (data.status == 'failed') {
                alert(data.message);
            } else {
                // window.location.href = '/';
                console.log(data);
                alert("Register Success");
            }
        })
});