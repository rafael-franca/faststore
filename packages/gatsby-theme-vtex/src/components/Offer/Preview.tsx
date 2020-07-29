import React, { FC } from 'react'
import Box from '@material-ui/core/Box'
import Skeleton from 'react-loading-skeleton'
import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

interface Props {
  variant?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
}))

const OfferPreview: FC<Props> = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Skeleton height={20} />
      <Skeleton height={23} />
      <Skeleton height={20} />
    </Box>
  )
}

export default OfferPreview
