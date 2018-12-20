export default (val, api) =>
  val.fileList.length
    ? val.fileList.filter(x => x.status === 'done').map(x => {
        console.log(x);

        return {
          uid: x.response.id,
          name: x.response.name,
          status: 'done',
          url: api.url + x.response.link,
        };
      })
    : [];
