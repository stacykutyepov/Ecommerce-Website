import { all, call } from 'redux-saga/effects';

import { fetchCollectionsStart } from './shop/shop.saga';

export default function* rootSaga() {
    // all - allows to take different sagas concurrently
    yield all([call(fetchCollectionsStart)]);
}