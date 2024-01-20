import React from 'react';

import DataNotFound from '@xcoolsports/components/Common/Pages/DataNotFound';
import ServerFailure from '@xcoolsports/components/Common/Pages/ServerFailture';
import InternetFailure from '@xcoolsports/components/Common/Pages/InternetFailture';

const RenderError = ({ isError, error }) => {
    if (!isError) return null;
    if (error.status === 404) return <DataNotFound />
    if (error.status === 500) return <ServerFailure />

    return <InternetFailure />
};

export default RenderError;