CREATE POLICY "Public can view landlord profiles"
ON public.profiles
FOR SELECT
USING (is_landlord = true);