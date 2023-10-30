import NextHead from "next/head"
import React from "react"

type HeadProps = {
  title: string
  description?: string | null
  image?: string | null
}

const Head: React.FC<HeadProps> = ({ title, description, image }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME
  return (
    <NextHead>
      <title>{`${title} | ${appName}`}</title>
      <meta itemProp="name" content={title} />
      {description && <meta itemProp="description" content={description} />}
      {image && <meta itemProp="image" content={image} />}
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  )
}

export default Head