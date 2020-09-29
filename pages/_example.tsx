import * as React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { gql } from 'graphql-request';
import { client } from '../client';
import { Text } from 'ether-ui';

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Page seo={post.seo!}>
    <Text>post</Text>
  </Page>
);

type Data = {
  post: Post_Post_Entry;
};

export const getStaticProps: GetStaticProps<Data> = async (context) => {
  const { post } = await client(
    context.preview ? context.previewData?.previewToken : undefined,
  ).request<Data>(
    gql`
      query {
        post: entry(slug: "post") {
          ... on post_post_Entry {
            id
            slug
            title
            seo {
              title
              description
            }
          }
        }
      }
    `,
  );

  return {
    props: {
      post,
    },
    revalidate: 1,
  };
};

type Posts = {
  posts: Post_Post_Entry[];
};

export const getStaticPaths = async () => {
  const { posts } = await client().request<Posts>(
    gql`
      query {
        posts: entries(section: "post") {
          ... on post_post_Entry {
            id
            slug
          }
        }
      }
    `,
  );

  return {
    paths: posts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

export default Post;
