// netlify-lang-check plugin

module.exports = {
  onInit: () => {
    console.log('onInit: I run before anything else 🐣');
  },
  onPreBuild: () => {
    console.log('onPreBuild: I run_before_ build commands are executed 🌤');
  },
  onBuild: () => {
    console.log('onBuild: I run while build commands are being executed ⚙️');
  },
  onPostBuild: () => {
    console.log('onPostBuild: I run _after_ build commands are executed ✅');
  },
  onSuccess: () => {
    console.log('onSuccess: I run on build success 🎉');
  },
  onError: () => {
    console.log('onError: I run on build error 🚒');
  },
  onEnd: () => {
    console.log(
      'onEnd: I run on build error or success when the build process ends 🎬'
    );
  },
};
