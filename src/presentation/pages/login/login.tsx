import React from 'react'
import Styles from './login-styles.scss'
import Spinner from '@/presentation/components/spinner/spinner';

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}>
        <img src="data:image/svg;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAABXCAMAAAD4QHEDAAACalBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////EfdF5AAAAzXRSTlMAAQIDBAUGBwgJCgsMDg8QERITFBUWFxgZGx0eHyAhIiMkJSYoKSorLS4vMDEyMzQ1Njc4OTo8P0BBQkNERUdJSktNTk9RVFVWV1hZWltcXl9gYmVmaWprbG5vcnN0dXZ3eHl6fH1/gYKDhIWHiIqLjpCRkpOUlZaYmpucnp+goqOlpqepqqusra6vsrS1uLm6u7y9vr/AwcLExsfKy8zOz9DR09XW19jZ2tvc3d7f4OHi5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+akoHMAAAAAFiS0dEzW3Qo0UAAAQsSURBVGjexZrnWxNBEMbnhCDS1CgiAmJFULGjYMeKBQuCoqJgF7uoYAl27EpTwYYFUUSwVzgERAhi7n+S8lBm7i5c2Vzm48z78nty2ezszgGgIFwfCgrDxn8vL849s2v1FHdgEHsE9dH0+PiKvjq5k5oEbWG9Ez9QB9frjaA9rFlTNYPPCvqicJY27mJBd+SGaOD6V+oHC9ZUV7XcXnkCk3gcrBKcJDAKfpEq7pgGVmChOV4Ft/cLgV3YUpSD07C1oVgfeodS7hwbNm48rfMzxyrjDviCfdkcBf8KxhEyIXLVTkvxPzlyQ4QicBZ2/RgMFMxLG72jLbw0+ZuSvXsdMS0EpeCWMK18Jkm+0jN3WC22ZIAacEsseCtFXt5j83+EDSUeasHgvrdZDK7sr675W8NBNRgg8puYfNC+JZw0/62gBQzDPojA9YPtbllkqyhw0QaGoe9F5HR7+sNYWx0AGsEwqkbUI+38pKaRVbEMNINhiY2SN8tqPUqx0gI6wOKj02tOTnoMC8u9dYEH/KTkSBllFN5r/3adEzWBYT0Fn5DWeZIdZx/oBPf+RGwV0rpTWPXcTS9YfH4araAJW8NAN9jcSHxJEiKfj1izDfSD4Qbx3ZTQnMOShy4swDHE90mil5GNdSSwAJvpmcRPpPiKBYnABAxFxDifCi7hej7HCHyEGLeT+jxcrgkERuA1xHiS7NEVuLwWWIHHE+MtXD7a06LXDHYnLeoFHjngZsj7sQMDaRRV6Hj3FBfjgCGYXsJM3WopuHSPYwm+Q5zeXaWg36jyZziwBF8hzkFdpRxcSQam4PPEGdRZWU2WnYkt+JRcYzT/wNf3CcAWnEGcYTKP4hAwBluIs2MFReEf+DtP1uCLxOnfnnYj59k5wBp8nTjN7ektOJsJzMGFxNmnLev7CzclP/ZgMoi1clLf/CZgD64jd4T2Kyk+mJSY2IP704lua5Ijz38usAfPIMYLrclYnLsBDgAnSowFPPClvXGEI8BnBHHLTZW9KTEE0wHQWIAh9fio7eUIcADxNbas36s4tRIcAaazuictOZwp4lSB62Z3xnh7vvuCeFhHdhTebjTKT2az7XAD/4mnk8BqDG4PvJ9+xV7GgL2riTYHjAHvpNpNxoAD6uiEzdcY8E0qvQyGgBNF0tmGgCOsVFnKGQEeJxrrdWyOjgVPrBIJi3sZAI6tFwsXg8PBZouELq+jG6SoCfou+U9XKUY0wUyQevNcF6Tp7XmZ4rY4MPmz5INJAAeCXUI35DdLfyG3OTbgbv24LaKXxu223KuVXQgvfYANWGVUDgengGsiwClgXvu/ougCfw0Fp4AL/MEZYFuaCZwBLpkJ4ARwdYobOAHMH/AFMB5clugJYDj4Xdp0DsBYsO1VZnwIMIu7VU3dgy+nUVb0IPdaenLM5H49/an/4prqqEtP7/4AAAAASUVORK5CYII="></img>
        <h1>4Dev - Enquetes para Programadores</h1>
      </header>
      <form className={Styles.form}>
        <h2>Login</h2>
        <div className={Styles.inputWrap}>
          <input type="email" name="email" placeholder="Digite seu e-mail" />
          <span className={Styles.status}>🔴</span>
        </div>
        <div className={Styles.inputWrap}> 
          <input type="password" name="password" placeholder="Digite sua senha" />
          <span className={Styles.status}>🔴</span>
        </div>
        <button className={Styles.submit} type="submit">Entrar</button>
        <span className={Styles.link}>Criar conta</span>
        <div className={Styles.errorWrap}>
          <Spinner  className={Styles.spinner}/>             
          <span className={Styles.error}>Error</span>
        </div>
      </form>
      <footer className={Styles.footer} />
    </div>
  )
}

export default Login