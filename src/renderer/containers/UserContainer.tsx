import { connect } from 'react-redux'
import { User } from '../components/User'
import { saveUser, fetchUser } from '../actions';
import { ThunkDispatch } from 'redux-thunk';

​const mapStateToProps = (state:any) => {
  return {
    user: state.user,
  }
}
​
const mapDispatchToProps = (dispatch:ThunkDispatch<any,any,any>) => {
  return {
    saveUser: (userForm:any) => dispatch(saveUser(userForm)),
    fetchUser: () => dispatch(fetchUser())
  }
}
​
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
