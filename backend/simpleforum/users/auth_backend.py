import base64
import datetime
import json

from rest_framework import authentication, exceptions
from users.models import User, Token


class AuthBackend(authentication.BaseAuthentication):
    authentication_header_prefix = 'Token'

    def authenticate(self, request, token=None, **kwargs):
        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header or auth_header[0].lower() != b'token':
            return None

        if len(auth_header) == 1:
            raise exceptions.AuthenticationFailed('Invalid token header. No credentials provided')
        if len(auth_header) > 2:
            raise exceptions.AuthenticationFailed('Invalid token header. Token string must not contain spaces')

        try:
            token = auth_header[1].decode('utf-8')
        except UnicodeError:
            raise exceptions.AuthenticationFailed('Invalid token header. Token strint should not contain invalid characters')

        user = User.objects.filter(token__access_token=token).first()

        # Check for expired token
        if user:
            bs64code = bytes.fromhex(token)
            decoded_token = json.loads(base64.b64decode(bs64code).decode('utf-8'))
            print(decoded_token)
            if datetime.datetime.now() < datetime.datetime.strptime(decoded_token['exp'], "%d/%m/%Y %H:%M:%S"):
                usr_token = Token.objects.filter(access_token=token).first()
                usr_token.save()
                return (user, None)
            raise exceptions.AuthenticationFailed('Expired token.')


        raise exceptions.AuthenticationFailed('Invalid or expired token.')
