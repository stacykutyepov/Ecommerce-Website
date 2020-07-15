import { takeLatest, call, put } from 'redux-saga/effects';
import { firestore, convertCollectionSnapshotToMap } from '../../firebase/firebase.utils';
import { fetchCollectionsSuccess, fetchCollectionsFailure } from './shop.actions'

import ShopActionTypes from './shop.types';

// writing generators

export function* fetchCollectionsAsync() {
    yield console.log('I am fired');
    try {
        const collectionRef = firestore.collection("collections");
        const snapshot = yield collectionRef.get();
        // use call in case the call takes longer than we expect
        const collectionsMap = yield call(convertCollectionSnapshotToMap, snapshot);
        // put is a saga effect for creating actions
        yield put(fetchCollectionsSuccess(collectionsMap));
    } catch (error) {
        yield put(fetchCollectionsFailure(error));
    }
}

export function* fetchCollectionsStart() {
    yield takeLatest(ShopActionTypes.FETCH_COLLECTIONS_START,
        fetchCollectionsAsync)
}