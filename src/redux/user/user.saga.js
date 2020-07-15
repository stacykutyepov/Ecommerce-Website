import { takeLatest, put, all, call } from 'redux-saga/effects';
import UserActionTypes from './user.types';
import { signInSuccess, signInFailure } from './users.actions';

import { auth, googleProvider, createUserProfileDocument } from '../../firebase/firebase.utils';

// listen to GoogleSingInStart and then trigger actual one from the saga
// write reusable generator function
export function* getSnapshotFromUserAuth(userAuth) {
    try {
        const userRef = yield call(createUserProfileDocument, userAuth)
        const userSnapshot = yield userRef.get();
        yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }))
        // console.log(user)
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signInWithGoogle() {
    try {
        // destructure user from the object we get
        const { user } = yield auth.signInWithPopup(googleProvider);
        yield getSnapshotFromUserAuth(user);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* onGoogleSignInStart() {
    yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle)
}

export function* signInWithEmail({ payload: { email, password } }) {
    try {
        const { user } = yield auth.signInWithEmailAndPassword(email, password);
        console.log(user);
        const userRef = yield call(createUserProfileDocument, user)
        const userSnapshot = yield userRef.get();
        yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }))
    } catch (error) {
        put(signInFailure(error))
    }
}

export function* onEmailSignInStart() {
    yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail)
}

export function* userSagas() {
    yield all([call(onGoogleSignInStart), call(onEmailSignInStart)]);
}