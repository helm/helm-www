module.exports = {
  onPreBuild: async () => {
    try {
      badMethod()
      console.log('Hello world from onPreBuild event!')
    } catch (error) {
      return utils.build.failBuild('Failure message')
    }
  },
}
