$(function() {
  $('#login').click(function() {
    navigator.id.request();
  });

  $('#logout').click(function() {
    navigator.id.logout();
  });

  navigator.id.watch({
    onlogin: function(assertion) {
      // A user has logged in! Here you need to:
      // 1. Send the assertion to your backend for verification and to create a session.
      // 2. Update your UI.
      $.ajax({
        type: 'POST',
        url: '/auth/login',
        data: {assertion: assertion},
        success: function(res, status, xhr) { showLoggedIn(res, assertion); },
        error: function(res, status, xhr) { alert("login failure: HTTP " + res.status); }
      });
    },
    onlogout: function() {
      // A user has logged out! Here you need to:
      // Tear down the user's session by redirecting the user or making a call to your backend.
      // Also, make that loggedInUser will get set to null on the next page load.
      // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
      $.ajax({
        type: 'POST',
        url: '/auth/logout',
        success: function(res, status, xhr) { showLoggedOut(res); },
        error: function(res, status, xhr) { alert("logout failure: HTTP " + res.status); }
      });
    }
  });
});

function showLoggedIn(res, assertion) {
  $('#status').html('Logged In!');
  $('#login').removeClass('active');
  $('#logout').addClass('active');
}

function showLoggedOut(res, assertion) {
  $('#status').html('Logged out');
  $('#logout').removeClass('active');
  $('#login').addClass('active');
}
