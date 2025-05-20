const ALL_ROUTES = (appProps) => [
    ...LOGIN_ROUTES,
    {
      path: `${onBoard}`,
      element: <OnBoard {...appProps} />,
    },
    {
      path: `/app`,
      element: <AppLayout {...appProps} />,
    },
    {
      path: "/onboard-success",
      element: <OnBoardSuccess {...appProps} />,
    },
    {
      path: ROUTES.ORGANIZATION,
      element: <OrganizationLayout {...appProps} />,
      children: [
        { index: true, element: <Campaign {...appProps} /> },
        {
          path: `${ROUTES.ORGANIZATION}/user`,
          element: <RoleAccess {...appProps} />,
        },
        {
          path: `${ROUTES.ORGANIZATION}/emails`,
          element: <Emails {...appProps} />,
        },
        {
          path: `${ROUTES.ORGANIZATION}/dataset`,
          element: <Dataset {...appProps} />,
        },
        {
          path: `${ROUTES.ORGANIZATION}/:campaignId`,
          element: <CampaignDetails {...appProps} />,
        },
      ],
    },
    {
      path: "/error",
      element: <Error />,
    },
    {
      path: "/unAuthorize",
      element: <UnAuthorize />,
    },
  ];
  
  export default ALL_ROUTES;