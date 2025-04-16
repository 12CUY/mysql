lottie.loadAnimation({
  container: document.getElementById("lottie"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "/animation/animation-login.json",
});

window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("error")) {
    Swal.fire({
      icon: "error",
      title: "Error de inicio de sesión",
      text: "Usuario o contraseña incorrectos",
      confirmButtonColor: "#3085d6",
    });
  }

  if (urlParams.has("logout")) {
    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "Has cerrado sesión correctamente",
      confirmButtonColor: "#3085d6",
    });
  }
});
