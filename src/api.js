export const fetchData = async () => {
  const data = await fetch(
      'http://127.0.0.1:3000/api/v1/paths/nodes/by-life/6f92449f-963e-4d76-bf8f-d209273683f4',
      //'http://127.0.0.1:3000/api/v1/paths/nodes/by-life/dcf8cebd-477c-4810-aabe-15b518a40dc1',
      {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIyYWJiZWMyLTJlNGQtNGM3Mi05ZjlkLThmYmU3NzFlY2JlZSIsImVtYWlsIjoicmlzLnRza0BnbWFpbC5jb20iLCJpYXQiOjE3MzEwNTE4NDYsImV4cCI6MTczMTEzODI0Nn0.F4vdi8153DpahN76Vc3upvwigwVcB4J9L1X8v7PShTY',
        },
      });

  return await data.json();
};