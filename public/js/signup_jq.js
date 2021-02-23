$('#FORM').submit(e => {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/auth/signup',
        data: {
            name: e.target.name,
            email: e.target.email.value,
            password: e.target.password.value
        }
    })
    .done(data => {
        console.log('done');
        console.log(data);
    })
    .fail((err) => {
        console.log(err.responseJSON);
    })
});