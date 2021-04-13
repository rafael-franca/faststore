import type { PageProps } from 'gatsby'
import type { FC } from 'react'
import React, { useEffect } from 'react'

/** There are three different cases that we need to consider when the user
  is back online.

  1. User went offline, then navigated into a page that didn't trigger a fetch
  request to the server. The rendering of this offline page is handled by Gatsby,
  and there **is** a `location.state`. In this case, we're sending the user back
  to the page they were trying to access when they are back online.

  2. User is already seeing this offline page, and is currently at `/offline`.
  But then, they refresh the page. This refresh will throw away any state, so
  there **is not** a `location.state`. In this case, we're sending the user
  back to '/' when they are back online.

  3. User went offline, then navigated into a page that **did** trigger a fetch
  request to the server. In this case, our service worker will respond with
  this page's HTML. There will be no redirect, so the user would see this
  offline page, but would still be in the route there were trying to navigate
  to. In this case, we're sending the user to the page they were trying to
  access when they're back online.

  */
function handleUserBackOnline(
  locationContext: PagePropsWithNavigationState['location']
) {
  // Case 1.
  if (locationContext.state.previousPagePath) {
    const { previousPagePath } = locationContext.state

    window.location.href = previousPagePath

    return
  }

  // Case 3.
  if (!window.location.pathname.startsWith('/offline')) {
    window.location.reload()

    return
  }

  // Case 2.
  window.location.href = '/'
}

type PagePropsWithNavigationState = PageProps<
  Record<string, unknown>,
  Record<string, unknown>,
  { previousPagePath: string }
>

const Page: FC<PagePropsWithNavigationState> = ({ location }) => {
  useEffect(() => {
    window.addEventListener('online', (_) => handleUserBackOnline(location))

    return window.removeEventListener('online', (_) =>
      handleUserBackOnline(location)
    )
  }, [location])

  return (
    <div
      style={{
        height: '100vh',
        maxWidth: '96rem',
        marginRight: 'auto',
        marginLeft: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: '150px', height: '150px' }}>
          <svg viewBox="0 0 800 800">
            <path
              fill="#f71963"
              d="M656.59,186.14h-374c-29,0-47.57,30.83-34,56.46L286,313.44H218.18A24.94,24.94,0,0,0,196.12,350L316.45,577.75a24.94,24.94,0,0,0,44.08,0l32.68-61.52,41,77.62c14.43,27.3,53.52,27.35,68,.08L689.67,241.17C702.92,216.22,684.84,186.14,656.59,186.14Zm-168,150.72L407.76,489a16.6,16.6,0,0,1-29.33,0l-80.05-151.5A16.6,16.6,0,0,1,313,313.13H474.33A16.15,16.15,0,0,1,488.59,336.86Z"
            />
          </svg>
        </div>
        <h3
          style={{
            fontSize: '43px',
            fontWeight: 600,
            textAlign: 'center',
            color: '#0f3e99',
          }}
        >
          You are offline
        </h3>
        <p
          style={{
            paddingTop: '15px',
            paddingBottom: '15px',
            fontSize: '20px',
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          Once your connection is back, you will be redirected.
        </p>
      </div>
    </div>
  )
}

export default Page
