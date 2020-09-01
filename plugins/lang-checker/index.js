module.exports = {
  name: "lang-checker",
  onPreBuild: async () => {
    try {
      badMethod()
      console.log('Hello world from onPreBuild event!')
    } catch (error) {
      return utils.build.failBuild('Failure message')
    }
  },
}
