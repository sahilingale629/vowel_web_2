export const delay = async (time) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("delay");
      resolve();
    }, time);
  });
