# Deploy to Vercel

Deploying to [Vercel](https://vercel.com/) might be the easiest way to deploy.

- 1. Connect your GitHub project: [vercel.com/new](http://vercel.com/new)
- 2. Set the environment variables
- 3. Optional: You might need to override the build command to `npm install --legacy-peer-deps` if your project has peer dependencies issues.

That's it 🎉! Every deployment will have it's own URL.

Read [Common Errors when Deploying Remix to Vercel](https://saasrock.com/docs/articles/common-errors-when-deploying-remix-to-vercel) if you encounter an error.

---

## **Deployment Steps**

**💿 Go to** [**vercel.com/new**](http://vercel.com/new) **and select your repository**

![vercel-deployment-select-repository.png](https://qwcsbptoezmuwgyijrxp.supabase.co/storage/v1/object/public/novel/1717178208567-vercel-deployment-select-repository.png "vercel-deployment-select-repository.png")

**💿 Set up your environment variables**

> Hint: You can copy-paste the content of your .env.production local file, and Vercel will be smart enough to parse it.

Optionally, override the build command to `npm install --legacy-peer-deps`.

![vercel-deployment-set-environment-variables.png](https://qwcsbptoezmuwgyijrxp.supabase.co/storage/v1/object/public/novel/1717178226530-vercel-deployment-set-environment-variables.png "vercel-deployment-set-environment-variables.png")

**💿 Wait 1-3 min and visit the deployed URLs**

![vercel-deployment-success.png](https://qwcsbptoezmuwgyijrxp.supabase.co/storage/v1/object/public/novel/1717178675183-vercel-deployment-success.png "vercel-deployment-success.png")

**💿 Update the Function Region**

Change the function region to your database provider's region (i.e. Supabase). In my case I always choose **iad1 (North Virginia)**.

Vercel function region:

![vercel-project-settings-region.png](https://qwcsbptoezmuwgyijrxp.supabase.co/storage/v1/object/public/novel/1721940982821-vercel-project-settings-region.png "vercel-project-settings-region.png")

Database region (in this case, Supabase):

![supabase-project-settings-region.png](https://qwcsbptoezmuwgyijrxp.supabase.co/storage/v1/object/public/novel/1721941075247-supabase-project-settings-region.png "supabase-project-settings-region.png")

And redeploy if necessary.
