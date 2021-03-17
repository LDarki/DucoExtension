const getJSON = (url, qs_params = "") => {
  const buildQueryString = (params) => {
    return Object.entries(params)
      .map((d) => `${d[0]}=${d[1]}`)
      .join("&");
  }

  return new Promise((resolve, reject) => {
    const qs = qs_params ? "?" + buildQueryString(qs_params) : "";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${url}${qs}`);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        resolve(xhr.responseText);
      }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

const getRandomColor = () => {
  let letters = 'BCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

const getUserImage = (username) => 
{
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  canvas.width = canvas.height = 512;

  context.fillStyle = getRandomColor();
  context.beginPath();
  context.ellipse(
    canvas.width/2, canvas.height/2, 
    canvas.width/2, canvas.height/2, 
    0,
    0, Math.PI * 2
  );
  context.fill();

  context.font = (canvas.height/3) + "px serif";
  context.fillStyle = "#000";

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(username.substring(0, 1).toUpperCase(), canvas.width/2, canvas.height/2);

  let img = document.createElement("img");
  img.src = canvas.toDataURL("image/png");
  img.classList.add("img-shadow");

  return img;
}

const ease = (v, pow=4) => {
  return 1 - Math.pow(1 - v, pow);
}

const createExpandAnimation = () => 
{

  let {x, y} = {x:0, y:0};
  let animation = '';

  for (let step = 0; step <= 100; step++) {
    let easedStep = ease(step / 100);

    const xScale = x + (1 - x) * easedStep;
    const yScale = y + (1 - y) * easedStep;

    animation += `${step}% {
      transform: scale(${xScale}, ${yScale});
    }`;
  }

  return `
  @keyframes expandNotification {
    ${animation}
  }`;
}

const style = document.createElement('style');
style.textContent = createExpandAnimation();
document.head.append(style);