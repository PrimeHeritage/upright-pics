import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './context'
import { SubmitButton, SwitchField, TextField, TextareaField } from './fields'

/**
 * App-wide TanStack Form hook. Usage:
 *   const form = useAppForm({ defaultValues, validators: { onSubmit: schema }, onSubmit })
 *   <form.AppField name="email">{(f) => <f.TextField label="Email" />}</form.AppField>
 *   <form.AppForm><form.SubmitButton>Save</form.SubmitButton></form.AppForm>
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextareaField, SwitchField },
  formComponents: { SubmitButton },
})

export { FieldShell } from './fields'
