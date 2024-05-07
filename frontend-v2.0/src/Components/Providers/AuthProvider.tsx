import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { clientStore, freelancerStore, userStore } from 'src/Store/user.store'
import { getMe, refreshToken } from 'src/api/auth-apis'
import { switchToClient, switchToFreelancer } from 'src/api/user-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { EUserType } from 'src/utils/enum'

type Props = {
  children?: ReactNode
}

type IAuthContext = {
  id: string
  login: (token: any, data: any) => void
  loading: boolean
  authenticated: boolean
  setAuthenticated: (newState: boolean) => void
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

let logoutTimer: string | number | NodeJS.Timeout

export const ExpireTime = 86400000

const AuthProvider = ({ children }: Props) => {
  //Initializing an auth state with false value (unauthenticated)
  const [authenticated, setAuthenticated] = useState(false)
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  const { setState, state } = useSubscription(userStore)

  const setFreelancer = useSubscription(freelancerStore).setState
  const setClient = useSubscription(clientStore).setState

  const [tokenExpirationDate, setTokenExpirationDate] = useState(Date.now() + ExpireTime)

  const login = useCallback(
    async (token: any, data: any) => {
      setLoading(true)
      setState({ ...data, token })
      setToken(token)
      setAuthenticated(true)
      setTokenExpirationDate(Date.now() + ExpireTime)
      if (data.lastLoginAs === EUserType.FREELANCER) {
        await switchToFreelancer().then(res => {
          setFreelancer(res.data)
        })
      } else if (data.lastLoginAs === EUserType.CLIENT) {
        await switchToClient().then(res => {
          setClient(res.data)
        })
      }
      setLoading(false)
      localStorage.setItem('expiredIn', `${Date.now() + ExpireTime}`)
    },
    [setState]
  )

  const logout = useCallback(() => {
    setTokenExpirationDate(null)
  }, [])

  // useEffect(() => {
  // 	if (authenticated) {
  // 		setTokenExpirationDate(Date.now() + Number(process.env.REACT_APP_ACCESS_TOKEN_EXP))
  // 	}
  // }, [authenticated, token])

	useEffect(() => {
		setLoading(true)
		getMe().then(async (res) => {
			setState(res.data)
			setAuthenticated(true);
			const expiredIn = localStorage.getItem("expiredIn")
			console.log('time-left:', expiredIn)
			setTokenExpirationDate(Number(expiredIn));
			setLoading(false);
			if(res.data.lastLoginAs === EUserType.FREELANCER) {
				await switchToFreelancer().then((res) => {
					setFreelancer(res.data)
				})
			} else if (res.data.lastLoginAs === EUserType.CLIENT) {
				await switchToClient().then((res) => {
					setClient(res.data)
				})
			}
		}).catch((err) => {
			setAuthenticated(false);
			setLoading(false);
			console.log(err)
		}).finally(() => {
			setLoading(false);
		})
	}, []);

  useEffect(() => {
    if (authenticated) {
      const remainingTime = Number(tokenExpirationDate) - Date.now()
      logoutTimer = setTimeout(async () => {
        refreshToken()
          .then(() => console.log('Token is refreshed'))
          .catch(err => {
            console.log('sthing went wrong ', err)
            logout()
          })
      }, remainingTime)
    }
    return () => {
      clearTimeout(logoutTimer)
    }
  }, [authenticated, tokenExpirationDate, logout, token])
  return (
    <AuthContext.Provider value={{ id: state?.id, login, authenticated, setAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthContext, AuthProvider, useAuth }
