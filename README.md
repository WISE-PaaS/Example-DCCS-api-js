# DCCS-api-js

This git hub shows how an edge device to connect to WISE-PaaS IoT Hub service remotely and securely via DCCS api

## A secure method

Normally, if we are a developer of a WISE-PaaS application, we may have access to all the service credentials on the WISE-PaaS Management Portal. However, if we are now providing a service, we won't want our users to hard-code the uri in the code, because this may lead to privacy issues and security breaches. Therefore, as a service provider, we give out **service keys**. These keys are genuinely confidential and only authorized personnel could have access to it.

## The Method

Once we have the key, we may retreive service credentials via DCCS API.     See more [DCCS Documentation](http://bit.ly/wisepaas-apis-dccs)
