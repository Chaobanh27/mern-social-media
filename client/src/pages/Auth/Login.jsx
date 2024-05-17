import { TbSocial } from 'react-icons/tb'
import { ImConnection } from 'react-icons/im'
import { BsShare } from 'react-icons/bs'
import { AiOutlineInteraction } from 'react-icons/ai'
import { useForm } from 'react-hook-form'
import BgImg from '../../assets/img.jpeg'
import TextInput from '../../components/TextInput'
import CustomButton from '../../components/CustomButton'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
// import { useSearchParams } from 'react-router-dom'
import { loginUserAPI } from '../../redux/userSlice/userSlice'
import FieldErrorAlert from '../../components/FieldErrorAlert'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // let [searchParams] = useSearchParams()
  // const registeredEmail = searchParams.get('registeredEmail')
  // const verifiedEmail = searchParams.get('verifiedEmail')

  const submitLogIn = (data) => {
    const { email, password } = data

    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then(res => {
      if (!res.error) navigate('/')
    })
  }

  return (
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center'>
          <div className='w-full flex gap-2 items-center mb-6'>
            <div className='p-2 bg-[#065ad8] rounded text-white'>
              <TbSocial />
            </div>
            <span className='text-2xl text-[#065ad8] font-semibold'>
              ShareFun
            </span>
          </div>
          <p className='text-ascent-1 text-base font-semibold'>
            Log in to your account
          </p>
          <span className='text-sm nt-2 text-ascent-2'>Welcome back,</span>

          <form
            className='py-8 flex flex-col gap-5'
            onSubmit={handleSubmit(submitLogIn)}
          >
            <TextInput
              name='email'
              label='Email Address'
              placeholder='email@example.com'
              type='email'
              register={register('email', {
                required: 'Email Address is required!'
              })}
              styles='w-full rounded-full'
              labelStyle='ml-2'
              error={!!errors['email']}
            />
            <FieldErrorAlert errors={errors} fieldName={'email'} />

            <TextInput
              name='password'
              label='Password'
              placeholder='Password'
              type='password'
              styles='w-full rounded-full'
              labelStyle='ml-2'
              register={register('password', {
                required: 'Password is required!'
              })}
              error={!!errors['password']}
            />
            <FieldErrorAlert errors={errors} fieldName={'email'} />

            <Link
              to='/reset-password'
              className='text-sm text-right text-blue font-semibold'
            >
              Forgot Password ?
            </Link>

            <CustomButton
              type='submit'
              containerStyles={'interceptor-loading inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none'}
              title='Login'
            />
          </form>

          <p className='text-ascent-2 text-sm text-center'>
            Do not have an account?{' '}
            <Link
              to='/register'
              className='text-[#065ad8] font-semibold ml-2 cursor-pointer'
            >
              Create Account
            </Link>
          </p>
        </div>
        {/* RIGHT */}
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
          <div className='relative w-full flex  items-center justify-center'>
            <img
              src={BgImg}
              alt='Bg Image'
              className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
            />
            <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
              <BsShare size={14} />
              <span className='text-xs font-medium'>Share</span>
            </div>
            <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
              <ImConnection />
              <span className='text-xs font-medium'>Connect</span>
            </div>
            <div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
              <AiOutlineInteraction />
              <span className='text-xs font-medium'>Interact</span>
            </div>
          </div>

          <div className='mt-16 text-center'>
            <p className='text-white text-base'>
              Connect with friedns & have share for fun
            </p>
            <span className='text-sm text-white/80'>
              Share memories with friends and the world.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
