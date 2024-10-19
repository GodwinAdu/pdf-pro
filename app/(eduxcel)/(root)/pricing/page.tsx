
// import UpgradeButton from '@/components/UpgradeButton'
import UpgradeButton from '@/components/UpgradeButton'
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PLANS } from '@/config/plans'
import { currentProfile } from '@/lib/profile/currentProfile'
import { isUserSubscribed } from '@/lib/profile/subscription'

import { cn } from '@/lib/utils'
import { currentUser } from '@clerk/nextjs/server'

import {
  ArrowRight,
  Check,
  HelpCircle,
  Minus,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const Page = async () => {

  const user = await currentUser();
  if (!user) redirect("/")

  const profile = await currentProfile();
  if (!profile) redirect("/")

  const isSubscribed = await isUserSubscribed();
  const pricingItems = [
    {
      plan: 'Free',
      tagline: 'For small side projects.',
      quota: PLANS.find((p) => p.slug === 'free')!.quota,
      features: [
        {
          text: '5 pages per PDF',
          footnote:
            'The maximum amount of pages per PDF-file.',
        },
        {
          text: '2MB file size limit',
          footnote:
            'The maximum file size of a single PDF file.',
        },
        {
          text: 'Mobile-friendly interface',
        },
        {
          text: 'Higher-quality responses',
          footnote:
            'Better algorithmic responses for enhanced content quality',
          negative: true,
        },
        {
          text: 'PDF to Audio Conversion',
          footnote: 'Convert PDF documents to audio files for accessibility.',
          negative: true,
        },
        {
          text: 'Priority support',
          negative: true,
        },
      ],
    },
    {
      plan: 'Pro',
      tagline: 'For larger projects with higher needs.',
      quota: PLANS.find((p) => p.slug === 'pro')!.quota,
      features: [
        {
          text: '20 pages per PDF',
          footnote:
            'The maximum amount of pages per PDF-file.',
        },
        {
          text: '16MB file size limit',
          footnote:
            'The maximum file size of a single PDF file.',
        },
        {
          text: 'Mobile-friendly interface',
        },
        {
          text: 'Higher-quality responses',
          footnote:
            'Better algorithmic responses for enhanced content quality',
        },
        {
          text: 'PDF to Audio Conversion',
          footnote: 'Convert PDF documents to audio files for accessibility.',
        },
        {
          text: 'Priority support',
        },
      ],
    },
    {
      plan: 'Forever',
      tagline: 'For larger projects with higher needs.',
      quota: PLANS.find((p) => p.slug === 'forever')!.quota,
      features: [
        {
          text: 'More pages per PDF',
          footnote:
            'The maximum amount of pages per PDF-file.',
        },
        {
          text: 'Unlimited file size limit',
          footnote:
            'The maximum file size of a single PDF file.',
        },
        {
          text: 'Mobile-friendly interface',
        },
        {
          text: 'Higher-quality responses',
          footnote:
            'Better algorithmic responses for enhanced content quality',
        },
        {
          text: 'PDF to Audio Conversion',
          footnote: 'Convert PDF documents to audio files for accessibility.',
        },
        {
          text: 'Priority support',
        },
      ],
    },
  ]

  return (
    <>
      <MaxWidthWrapper className='mb-8 mt-4 text-center '>
        <div className='mx-auto mb-10 sm:max-w-lg max-w-5xl'>
          <h1 className='text-6xl font-bold sm:text-7xl'>
            Pricing
          </h1>
          <p className='mt-5 text-gray-600 dark:text-white/70 sm:text-lg'>
            Whether you&apos;re just trying out our service
            or need more, we&apos;ve got you covered.
          </p>
        </div>

        <div className='pt-4 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3'>
          <TooltipProvider>
            {pricingItems.map(
              ({ plan, tagline, quota, features }) => {
                const price =
                  PLANS.find(
                    (p) => p.slug === plan.toLowerCase()
                  )?.price.amount || 0

                const isProOrForeverPlan = plan === 'Pro' || plan === 'Forever';

                return (
                  <div
                    key={plan}
                    className={cn(
                      'relative rounded-2xl bg-white dark:bg-background shadow-lg',
                      {
                        'border-2 border-blue-600 shadow-blue-200':
                          plan === 'Pro',
                        'border-2 border-green-600 shadow-green-200':
                          plan === 'Forever',
                        'border-2 border-gray-300 shadow-gray-200':
                          plan === 'Free',
                      }
                    )}>
                    {isProOrForeverPlan && (
                      <div className={cn('absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white',
                        { 'bg-gradient-to-r from-green-600 to-cyan-600': plan === 'Forever' }
                      )}>
                        Upgrade now
                      </div>
                    )}

                    <div className='p-5'>
                      <h3 className='my-3 dark:text-black text-center font-display text-3xl font-bold'>
                        {plan}
                      </h3>
                      <p className='text-gray-500'>
                        {tagline}
                      </p>
                      <p className='my-5 font-display text-4xl font-semibold'>
                        {plan === 'Forever' ? "Contact Us" : ` GH${price}`}
                      </p>
                      <p className='text-gray-500'>
                        per month
                      </p>
                    </div>

                    <div className='flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50 dark:bg-inherit'>
                      <div className='flex items-center space-x-1'>
                        <p className="text-muted-foreground">
                          {quota.toLocaleString()} PDFs/mo
                          included
                        </p>

                        <Tooltip delayDuration={300}>
                          <TooltipTrigger className='cursor-default ml-1.5'>
                            <HelpCircle className='h-4 w-4 text-zinc-500' />
                          </TooltipTrigger>
                          <TooltipContent className='w-80 p-2'>
                            {`You can upload ${quota.toLocaleString()} PDF per month`}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <ul className='my-10 space-y-5 px-8'>
                      {features.map(
                        ({ text, footnote, negative }) => (
                          <li
                            key={text}
                            className='flex space-x-5'>
                            <div className='flex-shrink-0'>
                              {negative ? (
                                <Minus className='h-6 w-6 text-gray-300' />
                              ) : (
                                <Check className='h-6 w-6 text-blue-500' />
                              )}
                            </div>
                            {footnote ? (
                              <div className='flex items-center space-x-1'>
                                <p
                                  className={cn(
                                    'text-gray-600',
                                    {
                                      'text-gray-400':
                                        negative,
                                    }
                                  )}>
                                  {text}
                                </p>
                                <Tooltip
                                  delayDuration={300}>
                                  <TooltipTrigger className='cursor-default ml-1.5'>
                                    <HelpCircle className='h-4 w-4 text-zinc-500' />
                                  </TooltipTrigger>
                                  <TooltipContent className='w-80 p-2'>
                                    {footnote}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            ) : (
                              <p
                                className={cn(
                                  'text-gray-600',
                                  {
                                    'text-gray-400':
                                      negative,
                                  }
                                )}>
                                {text}
                              </p>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                    <div className='border-t border-gray-200' />
                    <div className='p-5'>
                      {!isSubscribed ? (
                        <>
                          {plan === 'Free' ? (
                            <Link
                              href={
                                user ? '/dashboard' : '/sign-in'
                              }
                              className={buttonVariants({
                                className: 'w-full',
                                variant: 'secondary',
                              })}>
                              {user ? 'Upgrade now' : 'Sign up'}
                              <ArrowRight className='h-5 w-5 ml-1.5' />
                            </Link>
                          ) : user ? (

                            <UpgradeButton plan={plan} profile={profile} />
                          ) : (
                            <Link
                              href='/sign-in'
                              className={buttonVariants({
                                className: 'w-full',
                              })}>
                              {user ? 'Upgrade now' : 'Sign up'}
                              <ArrowRight className='h-5 w-5 ml-1.5' />
                            </Link>
                          )}
                        </>
                      ) : (
                        <>
                          {plan === 'Free' ? (
                            <Link
                              href={
                                user ? '/contact_us' : '/sign-in'
                              }
                              className={buttonVariants({
                                className: 'w-full',
                                variant: 'secondary',
                              })}>
                              {user ? 'Pro Activated' : 'Sign up'}
                              <ArrowRight className='h-5 w-5 ml-1.5' />
                            </Link>
                          ) : user ? (

                            <Link
                              href='/contact_us'
                              className={buttonVariants({
                                className: 'w-full',
                              })}>
                              Contact Us
                            </Link>
                          ) : (
                            <Link
                              href='/sign-in'
                              className={buttonVariants({
                                className: 'w-full',
                              })}>
                              {user ? 'Upgrade Forever Mode' : 'Sign up'}
                              <ArrowRight className='h-5 w-5 ml-1.5' />
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              }
            )}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  )
}

export default Page
